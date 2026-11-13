// app/api/audit/route.ts
// Next.js App Router Endpoint (/api/audit):
// - Enforces strict server-only env credential check with friendly JSON fallback
// - Implements in-memory IP rate limiting (max 10 req/IP/hour, max 15 patents/batch)
// - Orchestrates OAuth2, Number Service normalization, & 4-endpoint EPO OPS retrieval
import { NextRequest, NextResponse } from 'next/server';
import { getEpoAccessToken, MissingEpoCredentialsError } from '@/lib/epoAuth';
import { normalizePatentNumber, fetchFullPatentAuditRecord } from '@/lib/epoClient';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const ipRateLimits = new Map<string, RateLimitBucket>();
const MAX_REQUESTS_PER_HOUR = 10;
const MAX_PATENTS_PER_BATCH = 15;
const ONE_HOUR_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  // 1. Identify Client IP & Enforce In-Memory Rate Limit (Protect 4 GB/week EPO Quota)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const now = Date.now();

  let bucket = ipRateLimits.get(clientIp);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + ONE_HOUR_MS };
  }

  if (bucket.count >= MAX_REQUESTS_PER_HOUR) {
    return NextResponse.json(
      {
        status: 'RATE_LIMITED',
        message: `IP rate limit exceeded (${MAX_REQUESTS_PER_HOUR} live audits/hour). Please switch to "Sample M&A Deal Mode" or wait until quota reset.`,
        quota: {
          used: bucket.count,
          limit: MAX_REQUESTS_PER_HOUR,
          resetAtIso: new Date(bucket.resetAt).toISOString(),
        },
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const rawInputs: string[] = Array.isArray(body.patentNumbers) ? body.patentNumbers : [];
    const targetCompanyName: string = body.targetCompanyName || '';

    // 2. Enforce Batch Size Limit (Max 15 Patents per Live Request)
    if (rawInputs.length > MAX_PATENTS_PER_BATCH) {
      return NextResponse.json(
        {
          status: 'BATCH_LIMIT_EXCEEDED',
          message: `Batch contains ${rawInputs.length} inputs, exceeding the maximum allowed ${MAX_PATENTS_PER_BATCH} patents per live batch to protect the 4 GB/week EPO fair-use quota.`,
          maxBatchSize: MAX_PATENTS_PER_BATCH,
        },
        { status: 400 }
      );
    }

    // 3. Verify OAuth2 Credentials & Acquire Cached Bearer Token
    const tokenMeta = await getEpoAccessToken();

    // Increment IP rate limit counter only after credentials check passes
    bucket.count += 1;
    ipRateLimits.set(clientIp, bucket);

    // 4. Normalize all messy inputs via EPO OPS Number Service without failing the batch
    const normalizedResults = await Promise.all(
      rawInputs.map((input) => normalizePatentNumber(input))
    );

    const validNormalized = normalizedResults.filter((n) => n.isValid);
    const malformedInputs = normalizedResults.filter((n) => !n.isValid);

    // 5. Query /biblio, /legal, /family, and /register for each valid normalized patent
    const auditedRecords = await Promise.all(
      validNormalized.map((norm) => fetchFullPatentAuditRecord(norm))
    );

    return NextResponse.json({
      status: 'OK',
      mode: 'LIVE_EPO_OPS_V3.2',
      targetCompanyName,
      oauth2: {
        cacheStatus: tokenMeta.cacheStatus,
        ttlSecondsRemaining: tokenMeta.ttlSecondsRemaining,
      },
      quota: {
        ipUsed: bucket.count,
        ipLimit: MAX_REQUESTS_PER_HOUR,
        batchSize: rawInputs.length,
        batchLimit: MAX_PATENTS_PER_BATCH,
      },
      malformedInputs,
      auditedRecords,
    });
  } catch (error: any) {
    // Graceful JSON fallback if EPO_OPS_CONSUMER_KEY or EPO_OPS_SECRET are missing/invalid
    if (error instanceof MissingEpoCredentialsError || error.message?.includes('OAuth2')) {
      return NextResponse.json(
        {
          status: 'CREDENTIALS_MISSING_OR_INVALID',
          advisory: 'SWITCH_TO_SAMPLE_DEAL_MODE',
          message:
            'EPO OPS API credentials (EPO_OPS_CONSUMER_KEY / EPO_OPS_SECRET) are not configured or invalid in the server environment. Please switch to "Sample M&A Deal Mode" to explore the full 12-patent Aetheris MedTech GmbH due diligence dataset, or add your keys to .env.local.',
          requiredEnvVars: ['EPO_OPS_CONSUMER_KEY', 'EPO_OPS_SECRET'],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: 'EPO_UPSTREAM_ERROR',
        message: error.message || 'Unexpected error communicating with EPO Open Patent Services.',
      },
      { status: 502 }
    );
  }
}


/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allows production builds to successfully complete even if
    // there are non-fatal TypeScript type mismatches.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to successfully complete even if
    // there are ESLint warnings.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;


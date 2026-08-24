/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Wildcard matches any Supabase project's storage CDN host —
        // no per-project edit needed once NEXT_PUBLIC_SUPABASE_URL is set.
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;

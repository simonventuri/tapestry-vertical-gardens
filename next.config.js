/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: "/tapestry-vertical-gardens",
  // output: "export",
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude Redis and other Node.js modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        redis: false,
        net: false,
        tls: false,
        fs: false,
        dns: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "api.rk-transport.com", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
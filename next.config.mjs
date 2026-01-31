/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "woi8jmqaak1w974e.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
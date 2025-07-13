import withPWAInit from 'next-pwa';

// Initialize next-pwa plugin
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: /* process.env.NODE_ENV === 'development' */ false, // Disable PWA in development mode
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["woi8jmqaak1w974e.public.blob.vercel-storage.com"],
  }
};

export default withPWA(nextConfig);
import withPWAInit from 'next-pwa';

// Initialize next-pwa plugin
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: /* process.env.NODE_ENV === 'development' */ false, // Disable PWA in development mode
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(nextConfig);
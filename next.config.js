/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-heavenex.fra1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
      },
      {
        protocol: 'https',
        hostname: 'cdn4.iconfinder.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },
 
  env: {
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
  },

}

module.exports = nextConfig
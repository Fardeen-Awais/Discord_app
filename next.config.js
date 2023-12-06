/** @type {import('next').NextConfig} */
const nextConfig = {
    // images:{
    //     domains: ["utfs.io"]
    // }

    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'utfs.io',
          },
        ],
      },
}

module.exports = nextConfig

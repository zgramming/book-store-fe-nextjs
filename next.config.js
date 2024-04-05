/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/master-book',
        permanent: true,
      },
    ];
  },
  // images: {
  //   domains: ["i.dummyjson.com"],
  // },
};

module.exports = nextConfig;

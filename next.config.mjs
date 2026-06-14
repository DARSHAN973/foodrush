/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remote image config — Next Image only renders external images
  // from domains that are explicitly allowed here.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

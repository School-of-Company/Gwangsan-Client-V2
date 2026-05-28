const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Both @zaemoru/* packages ship prebuilt ESM dist; transpiling them
  // again causes Next to bundle multiple module instances (and multiple
  // copies of Lit), which double-registers the custom elements.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

module.exports = nextConfig;

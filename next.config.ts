//import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Ensure correct worker loading
      'pdfjs-dist/build/pdf.worker': 'pdfjs-dist/build/pdf.worker.min.js',
    };
    
    // Add this for better PDF.js support
    config.module.rules.push({
      test: /pdf\.worker\.min\.js$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Enable React Strict Mode
  reactStrictMode: true,
  // Add custom headers for PDF responses
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Accept-Ranges', value: 'bytes' }
        ],
      },
    ];
  },
};

export default nextConfig;








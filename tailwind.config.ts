import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundLogo: 'var(--logo-bg)',
        colorLogo: 'var(--logo-color)',

        ijoPrimary: 'var(--ijo-primary)',
        ijo400: 'var(--ijo-400)',
      },
    },
  },
  plugins: [],
};
export default config;

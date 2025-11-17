// tailwind.config.js (Faylka waa inuu ku jiraa Root-ka mashruuca)

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Hubi Content-ka si uu u arko dhammaan faylalka .tsx iyo .js
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    // Sida sawirkaaga ka muuqata, waa inaad sidoo kale hubisaa /components
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Halkan waxaad ku dari kartaa midabo ama fonts custom-ka ah
    },
  },
  plugins: [],
}
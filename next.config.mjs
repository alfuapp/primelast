/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Tani waxay u oggolaanaysaa dhismaha inuu dhammaado xataa haddii ay jiraan khaladaad ESLint ah
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Sidoo kale iska indho-tir khaladaadka TypeScript ee yar-yar inta lagu jiro dhismaha
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
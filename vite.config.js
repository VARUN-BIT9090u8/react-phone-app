import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you want full auto PWA, run: npm install -D vite-plugin-pwa
// Then uncomment the VitePWA lines below.
// import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   manifest: {
    //     name: "React Phone",
    //     short_name: "Phone",
    //     theme_color: "#0a0a0a",
    //     background_color: "#0a0a0a",
    //     display: "standalone",
    //     icons: [
    //       { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    //       { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    //     ],
    //   },
    // }),
  ],
});
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    root: "frontend",
    plugins: [react()],
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL || env.SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_KEY)
    },
    server: { port: 5173, proxy: { "/api": "http://localhost:3000" } },
    build: { outDir: "dist", emptyOutDir: true }
  };
});

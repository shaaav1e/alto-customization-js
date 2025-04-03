import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  // Base path - use '/' for production, './' for relative paths
  base: "/",
});

import { defineConfig } from "vite";
import "./plugins/build-slides-from-templates.js";

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/slides/*.html"],
    },
  },
});

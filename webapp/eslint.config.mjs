import { defineConfig } from "eslint/config";

// Minimal ESLint config for production builds.
// Next.js will still type-check using TypeScript, but we avoid
// importing eslint-config-next presets that can break on Vercel.
export default defineConfig([]);

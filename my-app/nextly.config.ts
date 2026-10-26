import { formBuilder  } from "@nextlyhq/plugin-form-builder";
import { defineConfig } from "nextly/config";

const fb = formBuilder();

export default defineConfig({
  singles: [],

  typescript: {
    outputFile: "./src/types/generated/nextly-types.ts",
  },
    
  plugins: [fb.plugin],
  collections: []
});
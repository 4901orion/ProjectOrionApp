import { formBuilder } from "@nextlyhq/plugin-form-builder";
import { s3Storage } from "@nextlyhq/storage-s3";
import { defineConfig } from "nextly/config";

const fb = formBuilder();

// Uploaded files (Admin → Media, and files sent through forms) go to
// Supabase Storage when the SUPABASE_S3_* variables are set, using Supabase's
// S3-compatible endpoint. Without them, files are saved on local disk under
// public/uploads, which is fine for development but not on Vercel.
const useSupabaseStorage = Boolean(
  process.env.SUPABASE_S3_ENDPOINT && process.env.SUPABASE_S3_ACCESS_KEY_ID,
);

export default defineConfig({
  singles: [],

  typescript: {
    outputFile: "./src/types/generated/nextly-types.ts",
  },

  storage: useSupabaseStorage
    ? [
        s3Storage({
          bucket: process.env.SUPABASE_S3_BUCKET ?? "media",
          region: process.env.SUPABASE_S3_REGION!,
          endpoint: process.env.SUPABASE_S3_ENDPOINT!,
          forcePathStyle: true,
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
          // The bucket is PRIVATE. Nextly saves each file's link as
          // <FILES_BASE_URL>/<path>, which points at this app's protected
          // /files route (app/files/[...path]/route.ts). That route checks the
          // person is a logged-in reviewer/admin, then redirects to a signed
          // Supabase link that expires after 5 minutes.
          publicUrl: process.env.FILES_BASE_URL!,
          collections: { media: true },
        }),
      ]
    : [],

  plugins: [fb.plugin],
  collections: [],
});

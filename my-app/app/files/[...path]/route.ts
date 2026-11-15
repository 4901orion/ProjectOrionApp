import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getNextly } from "nextly";

import { canDownloadFiles } from "@/lib/files/can-download";
import nextlyConfig from "@/nextly.config";

// Protected downloads for uploaded files. Two kinds of address work:
//
//   /files/<media id>              e.g. /files/494e0875-ad90-...  (the ID a
//                                  submission stores for a file field)
//   /files/<year>/<month>/<name>   the link Nextly saves for each file, so
//                                  clicking a file in Admin → Media works too
//
// The Supabase Storage bucket is private. This route checks the person is a
// logged-in reviewer/admin (see lib/files/can-download.ts), then redirects to
// a signed Supabase link that expires after a few minutes.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LINK_LIFETIME_SECONDS = 300; // 5 minutes
const MEDIA_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function textResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const check = await canDownloadFiles();
  if (!check.ok) return textResponse(check.reason, check.status);

  const { path } = await params;
  const nextly = await getNextly({ config: nextlyConfig });

  // Work out the object's key in the bucket and the name to show.
  let key: string;
  let downloadName: string;
  if (path.length === 1 && MEDIA_ID.test(path[0])) {
    const media = await nextly.media
      .findByID({ id: path[0], overrideAccess: true })
      .catch(() => null);
    if (!media) return textResponse("File not found.", 404);
    key = media.filename; // e.g. "2026/11/<random>-resume.pdf"
    downloadName = media.originalFilename;
  } else {
    const parts = path.map((p) => decodeURIComponent(p));
    if (parts.some((p) => p === ".." || p === "." || p === "" || p.includes("/"))) {
      return textResponse("File not found.", 404);
    }
    key = parts.join("/");
    downloadName = key.split("/").pop() ?? "file";
  }

  const usingSupabase = Boolean(
    process.env.SUPABASE_S3_ENDPOINT && process.env.SUPABASE_S3_ACCESS_KEY_ID,
  );
  if (!usingSupabase) {
    // Local development: files are saved under public/uploads.
    return Response.redirect(new URL(`/uploads/${key}`, req.url), 302);
  }

  const client = new S3Client({
    region: process.env.SUPABASE_S3_REGION!,
    endpoint: process.env.SUPABASE_S3_ENDPOINT!,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
    },
  });
  const safeName = downloadName.replace(/["\\\r\n]/g, "_");
  const signed = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.SUPABASE_S3_BUCKET ?? "media",
      Key: key,
      ResponseContentDisposition: `inline; filename="${safeName}"`,
    }),
    { expiresIn: LINK_LIFETIME_SECONDS },
  );

  return new Response(null, {
    status: 302,
    headers: { location: signed, "cache-control": "no-store" },
  });
}

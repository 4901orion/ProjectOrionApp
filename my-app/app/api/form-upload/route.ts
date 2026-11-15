import { getNextly } from "nextly";

import nextlyConfig from "@/nextly.config";

// Receives a file from a form's "File upload" field, stores it in Nextly's
// media library, and returns its media ID. The form then sends that ID with
// the submission, so the file shows up on the submission in the admin.
//
// Nextly's own media endpoint only accepts logged-in Nextly admins, so form
// visitors upload through this route instead. It only accepts files for a
// published form that really has that file field, and checks size and type.

export const runtime = "nodejs";

const DEFAULT_MAX_BYTES = 100 * 1024 * 1024; // 100 MB, the plugin's default
const DEFAULT_ALLOWED = ["image/*", "application/pdf", "text/*"];
const FOLDER_NAME = "Form uploads";

type FileField = {
  type: string;
  name: string;
  accept?: string;
  maxFileSize?: number;
};

function typeAllowed(file: File, allowed: string[]) {
  const mime = (file.type || "").toLowerCase();
  const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
  return allowed.some((rule) => {
    const r = rule.trim().toLowerCase();
    if (!r) return false;
    if (r.startsWith(".")) return ext === r;
    if (r.endsWith("/*")) return mime.startsWith(r.slice(0, -1));
    return mime === r;
  });
}

function fail(message: string, status = 400) {
  return Response.json({ message }, { status });
}

export async function POST(req: Request) {
  let body: FormData;
  try {
    body = await req.formData();
  } catch {
    return fail("Expected a multipart form upload.");
  }

  const file = body.get("file");
  const formSlug = String(body.get("form") ?? "");
  const fieldName = String(body.get("field") ?? "");
  if (!(file instanceof File) || !formSlug || !fieldName) {
    return fail("Missing file, form or field.");
  }

  const nextly = await getNextly({ config: nextlyConfig });

  // The form must exist, be published, and contain this file field.
  const forms = await nextly.find({
    collection: "forms",
    where: { slug: { equals: formSlug } },
    limit: 1,
    overrideAccess: true,
  });
  const form = forms.items?.[0] as
    | { status?: string; fields?: FileField[] }
    | undefined;
  if (!form || form.status !== "published") {
    return fail("This form isn't accepting submissions.", 404);
  }
  const field = form.fields?.find((f) => f.name === fieldName);
  if (!field || field.type !== "file") {
    return fail("This form has no such file field.");
  }

  const maxBytes = field.maxFileSize ?? DEFAULT_MAX_BYTES;
  if (file.size === 0) return fail("The file is empty.");
  if (file.size > maxBytes) {
    return fail(`The file is too big. The limit is ${Math.round(maxBytes / 1024 / 1024)} MB.`, 413);
  }
  const allowed = field.accept ? field.accept.split(",") : DEFAULT_ALLOWED;
  if (!typeAllowed(file, allowed)) {
    return fail("This type of file isn't allowed.", 415);
  }

  // Keep visitor uploads together in one media folder.
  let folderId: string | undefined;
  try {
    const folders = await nextly.media.folders.list({ overrideAccess: true });
    folderId =
      folders.find((f) => f.name === FOLDER_NAME)?.id ??
      (await nextly.media.folders.create({ name: FOLDER_NAME, overrideAccess: true })).id;
  } catch {
    folderId = undefined; // fall back to the media root
  }

  const data = Buffer.from(await file.arrayBuffer());
  const media = await nextly.media.upload({
    file: {
      data,
      name: file.name,
      mimetype: file.type || "application/octet-stream",
      size: data.length,
    },
    folder: folderId,
    overrideAccess: true,
  });

  return Response.json(
    { id: media.id, filename: media.originalFilename ?? file.name },
    { status: 201 },
  );
}

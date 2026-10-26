import { createMediaHandlers } from "nextly/api/media-handlers";

import nextlyConfig from "@/nextly.config";

// Checked against the caller's media permissions, except the raw bytes of a
// publicly servable file (a web font), which a browser fetches without a session.
const handlers = createMediaHandlers({ config: nextlyConfig, requireAuth: true });

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
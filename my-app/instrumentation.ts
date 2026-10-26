export async function register(): Promise<void> {
  // Nextly needs Node.js; the Edge runtime cannot load it.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { registerNextCacheRevalidator } = await import("nextly/runtime");
  registerNextCacheRevalidator();

  const { createRegister } = await import("nextly");
  const { default: config } = await import("@/nextly.config");
  // Next.js writes its Cache Components setting into this file as it builds it.
  await createRegister(config, {
    cacheComponents: process.env.__NEXT_CACHE_COMPONENTS,
  })();
}
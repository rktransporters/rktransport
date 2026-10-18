import type { PagesContext } from "../types";

function hasMatchingSecret(supplied: string, expected: string): boolean {
  const encoder = new TextEncoder();
  const suppliedBytes = encoder.encode(supplied);
  const expectedBytes = encoder.encode(expected);
  let difference = suppliedBytes.length ^ expectedBytes.length;
  const length = Math.max(suppliedBytes.length, expectedBytes.length);

  for (let index = 0; index < length; index += 1) {
    difference |= (suppliedBytes[index] || 0) ^ (expectedBytes[index] || 0);
  }
  return difference === 0;
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (!env.REVALIDATE_SECRET || !env.PAGES_DEPLOY_HOOK_URL) {
    return Response.json({ detail: "Static-site redeployment is not configured" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return Response.json({ detail: "Invalid request body" }, { status: 400 });
  }
  const body = payload as { secret?: unknown; paths?: unknown };
  if (typeof body.secret !== "string" || !hasMatchingSecret(body.secret, env.REVALIDATE_SECRET)) {
    return Response.json({ detail: "Invalid revalidation secret" }, { status: 401 });
  }
  if (body.paths !== undefined && (!Array.isArray(body.paths)
    || body.paths.some((path) => typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")))) {
    return Response.json({ detail: "Paths must be site-relative paths" }, { status: 400 });
  }

  let hookUrl: URL;
  try {
    hookUrl = new URL(env.PAGES_DEPLOY_HOOK_URL);
  } catch {
    return Response.json({ detail: "Deploy hook URL is invalid" }, { status: 500 });
  }
  if (hookUrl.protocol !== "https:") {
    return Response.json({ detail: "Deploy hook URL must use HTTPS" }, { status: 500 });
  }
  const deployment = await fetch(hookUrl, { method: "POST" });
  if (!deployment.ok) {
    return Response.json({ detail: "Cloudflare rejected the Pages deployment hook" }, { status: 502 });
  }

  return Response.json({
    revalidated: true,
    deploymentTriggered: true,
    paths: Array.isArray(body.paths) && body.paths.length ? body.paths : ["/"],
  });
}

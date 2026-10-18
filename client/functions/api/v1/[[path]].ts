import type { PagesContext } from "../../types";

const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
const supportedMethods = new Set([...allowedMethods, "HEAD"]);

export async function onRequest({ request, env }: PagesContext): Promise<Response> {
  if (!supportedMethods.has(request.method)) {
    return Response.json(
      { detail: "Method not allowed" },
      { status: 405, headers: { Allow: allowedMethods.join(", ") } },
    );
  }

  if (!env.API_BASE_URL) {
    return Response.json({ detail: "API_BASE_URL is not configured" }, { status: 500 });
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = `${env.API_BASE_URL.replace(/\/$/, "")}${incomingUrl.pathname}${incomingUrl.search}`;
  const headers = new Headers();
  for (const name of ["accept", "content-type", "cookie", "authorization"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const response = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  for (const name of ["content-type", "cache-control"]) {
    const value = response.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  const cookie = response.headers.get("set-cookie");
  if (cookie) responseHeaders.append("set-cookie", cookie.replace(/;\s*Domain=[^;]*/i, ""));

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

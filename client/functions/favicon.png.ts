import type { PagesContext } from "./types";

export async function onRequest({ env }: PagesContext): Promise<Response> {
  if (!env.API_BASE_URL) {
    return new Response("API_BASE_URL is not configured", { status: 500 });
  }
  const upstreamUrl = `${env.API_BASE_URL.replace(/\/$/, "")}/api/v1/favicon.png`;
  const response = await fetch(upstreamUrl, { cache: "no-store" });
  const headers = new Headers();
  for (const name of ["content-type", "cache-control"]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(response.body, { status: response.status, headers });
}

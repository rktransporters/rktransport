import type { PagesContext } from "../../types";

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function readCookie(request: Request, name: string): string | undefined {
  const prefix = `${name}=`;
  return request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

async function hasValidAdminSession(request: Request, env: PagesContext["env"]): Promise<boolean> {
  const token = readCookie(request, env.COOKIE_NAME || "access_token");
  const secret = env.SECRET_KEY;
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
    if (header.alg !== "HS256" || typeof claims.sub !== "string" || Number(claims.exp) <= Date.now() / 1000) {
      return false;
    }
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const signatureBytes = decodeBase64Url(parts[2]);
    const signature = new ArrayBuffer(signatureBytes.length);
    new Uint8Array(signature).set(signatureBytes);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
  } catch {
    return false;
  }
}

export async function onRequest(context: PagesContext): Promise<Response> {
  if (await hasValidAdminSession(context.request, context.env)) {
    return context.next();
  }

  const login = new URL("/admin", context.request.url);
  login.searchParams.set("next", new URL(context.request.url).pathname);
  return Response.redirect(login, 307);
}

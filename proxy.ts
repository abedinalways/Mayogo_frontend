import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_KEY = "mayogo_auth_session";
const ROLE_COOKIE_KEY = "mayogo_admin_role";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/otp",
  "/forget-password",
  "/forgot-password",
  "/set-password",
  "/verify-account",
];

const SUPER_ADMIN_ONLY_ROUTES = ["/dashboard/roles-permissions"];

/**
 * Verifies JWT token signature (HMAC SHA-256) and expiration using standard Web Crypto API.
 */
async function verifyJwt(token: string | undefined, secret: string): Promise<boolean> {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  try {
    const [headerB64, payloadB64, signatureB64] = parts;
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = enc.encode(`${headerB64}.${payloadB64}`);

    const base64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binary = atob(pad);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, data);
    if (!isValid) {
      return false;
    }

    const payloadJson = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);
    if (payload.exp && typeof payload.exp === "number") {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (nowInSeconds >= payload.exp) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Cryptographically verifies if the user is a verified Super Admin via HMAC signed cookie
 */
async function verifySuperAdminCookie(
  cookieValue: string | undefined,
  secret: string
): Promise<boolean> {
  if (!cookieValue || typeof cookieValue !== "string") return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;

  try {
    const [payloadB64, signatureB64] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const base64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binary = atob(pad);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const rawPayloadBase64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const padPayload = rawPayloadBase64.padEnd(
      rawPayloadBase64.length + ((4 - (rawPayloadBase64.length % 4)) % 4),
      "="
    );
    const payloadStr = atob(padPayload);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(payloadStr)
    );

    if (!isValid) return false;

    const parsed = JSON.parse(payloadStr);
    return Boolean(parsed.isSuperAdmin === true);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_KEY)?.value;
  const roleCookie = request.cookies.get(ROLE_COOKIE_KEY)?.value;

  const isAuthenticated = await verifyJwt(token, JWT_SECRET);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isSuperAdminRoute = SUPER_ADMIN_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Root route: redirect according to auth state
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Protected dashboard routes: require a valid verified token
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(AUTH_COOKIE_KEY);
    }
    return response;
  }

  // 3. Super Admin Only Route Guard (e.g. /dashboard/roles-permissions)
  if (isSuperAdminRoute && isAuthenticated) {
    const isSuperAdmin = await verifySuperAdminCookie(roleCookie, JWT_SECRET);
    if (!isSuperAdmin) {
      // Non-superadmin cannot access roles-permissions page
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 4. Guest/Auth routes: logged in users cannot access /login, /register, /otp, /forget-password, etc.
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/otp",
    "/forget-password",
    "/forgot-password",
    "/set-password",
    "/verify-account",
  ],
};

import { NextResponse } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

async function createHmacSignature(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const bytes = new Uint8Array(sigBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function POST(req: Request) {
  try {
    const { isSuperAdmin, userId } = await req.json();

    const payloadStr = JSON.stringify({
      isSuperAdmin: Boolean(isSuperAdmin),
      userId: userId || "",
      timestamp: Date.now(),
    });

    const signature = await createHmacSignature(payloadStr, JWT_SECRET);
    const cookieValue = `${btoa(payloadStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}.${signature}`;

    const res = NextResponse.json({ success: true });
    res.cookies.set("mayogo_admin_role", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("mayogo_admin_role");
  return res;
}

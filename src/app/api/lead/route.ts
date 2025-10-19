import { NextRequest, NextResponse } from "next/server";

const functionUrl = process.env.LEAD_FUNCTION_URL;
const isDev = process.env.NODE_ENV === "development";

async function fetchIdentityToken(audience: string) {
  const metadataUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(
    audience
  )}&format=full`;

  const response = await fetch(metadataUrl, {
    headers: {
      "Metadata-Flavor": "Google",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to obtain identity token: ${response.status} ${text}`);
  }

  return response.text();
}

async function proxyToCloudFunction(body: string) {
  if (!functionUrl) {
    throw new Error("Missing LEAD_FUNCTION_URL environment variable");
  }

  const identityToken = await fetchIdentityToken(functionUrl);

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${identityToken}`,
    },
    body,
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return NextResponse.json(
      { ok: false, error: "Unexpected response from lead handler", details: text },
      { status: 502 }
    );
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest) {
  if (isDev) {
    return NextResponse.json(
      { ok: false, error: "Use /api/dev/lead for local development submissions." },
      { status: 400 }
    );
  }

  try {
    const body = await req.text();
    return await proxyToCloudFunction(body);
  } catch (error) {
    console.error("Failed to proxy lead submission:", error);
    return NextResponse.json(
      { ok: false, error: "Lead submission proxy error. Please try again later." },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}

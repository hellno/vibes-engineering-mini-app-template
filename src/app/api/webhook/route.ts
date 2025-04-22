import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  console.log("/webhook POST", body);

  const notificationBackendEndpoint = `${process.env.VIBES_ENGINEERING_NOTIFICATION_BACKEND_ENDPOINT}?project_id=${process.env.NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID}`;

  const res = await fetch(notificationBackendEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
    },
    body,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

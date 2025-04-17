import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const endpoint = `${process.env.GET_UPLOAD_JWT_ENDPOINT}?project_id=${process.env.NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to retrieve JWT token from backend" },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

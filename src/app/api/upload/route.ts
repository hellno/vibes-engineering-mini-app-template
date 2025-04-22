import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseClientWithToken } from "~/lib/supabase";

export async function POST(request: NextRequest) {
  // Parse multipart form data using built-in formData()
  const formData = await request.formData();
  const fileField = formData.get("file");
  if (!(fileField instanceof File)) {
    return NextResponse.json(
      { success: false, error: "No file uploaded" },
      { status: 400 },
    );
  }
  const fileData = fileField;

  // Fetch JWT token from backend
  const jwtResponse = await fetch(new URL("/api/get-jwt", request.url));
  if (!jwtResponse.ok) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch JWT token" },
      { status: 400 },
    );
  }
  const { token } = await jwtResponse.json();
  const supabase = createSupabaseClientWithToken(token);

  // Compute bucket name from env var
  const bucket = `file-storage-${process.env.NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID}`;

  // Upload file to Supabase Storage
  const filename = fileField.name;
  const { data: uploadData, error } = await supabase.storage
    .from(bucket)
    .upload(filename, fileData, { upsert: false });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }

  // Optionally, generate a public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return NextResponse.json({
    success: true,
    publicUrl: publicUrlData.publicUrl,
  });
}

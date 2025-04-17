"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "~/components/dropzone";
import { useSupabaseUpload } from "~/hooks/use-supabase-upload";

export default function FileUploadCard() {
  const bucketName = `file-storage-${process.env.NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID}`;
  const props = useSupabaseUpload({
    bucketName,
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 5, // 5MB,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
        <CardDescription>Upload a file to storage</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Dropzone {...props}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </CardContent>
    </Card>
  );
}

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { createSupabaseClientWithToken } from "~/lib/supabase";

interface StorageObject {
  name: string;
  type: string;
  size: number;
  updated_at: string;
  publicUrl?: string;
  metadata: {
    mimetype: string;
    size: number;
    httpStatusCode: number;
  };
}

const bucketName = `file-storage-${process.env.NEXT_PUBLIC_VIBES_ENGINEERING_PROJECT_ID!}`;

export default function BucketExplorer() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const fetchToken = () => {
    fetch("/api/get-jwt")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch token");
        }
        return res.json();
      })
      .then((data) => {
        setToken(data.token);
        setTokenError(null);
      })
      .catch((err) => {
        console.error("Error fetching token", err);
        setTokenError(err.message);
      });
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const [files, setFiles] = useState<StorageObject[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchFiles = useCallback(
    async (pageParam: number) => {
      if (!token) return;

      const supabase = createSupabaseClientWithToken(token);

      setLoading(true);
      try {
        const result = await supabase.storage
          .from(bucketName)
          .list("", { limit: 50, offset: (pageParam - 1) * 50 });
        if (result.error) {
          setError(result.error.message);
          setLoading(false);
          return;
        }
        const filesArray = result.data as unknown as StorageObject[];
        const filteredFiles = filesArray.filter(
          (file) => !file?.name?.startsWith(".") && file.metadata.size > 0,
        );
        const filesWithPreview = filteredFiles.map((file) => {
          if (file?.metadata.mimetype.startsWith("image/")) {
            const {
              data: { publicUrl },
            } = supabase.storage.from(bucketName).getPublicUrl(file.name);
            return { ...file, publicUrl };
          }
          return file;
        });
        setFiles((prevFiles) => {
          const newFiles = filesWithPreview.filter(
            (file) =>
              !prevFiles.some((existing) => existing.name === file.name),
          );
          const updatedFiles = [...prevFiles, ...newFiles];
          if (filesWithPreview.length < 50 || newFiles.length === 0) {
            setHasMore(false);
          }
          return updatedFiles;
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (token) {
      fetchFiles(page);
    }
  }, [page, token, fetchFiles]);

  const fetchNextPage = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = observerRef.current;
    if (!currentElement) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [hasMore, loading, fetchNextPage]);

  if (!token) {
    return tokenError ? (
      <div>
        <p>Error fetching token: {tokenError}</p>
        <button onClick={fetchToken}>Retry</button>
      </div>
    ) : (
      <p>Loading bucket explorer...</p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bucket Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && page === 1 && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="border-b py-2">
                <div className="font-semibold">{file.name}</div>
                {file.metadata.mimetype?.startsWith("image/") &&
                file?.publicUrl ? (
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="mt-2 h-32 w-auto object-cover rounded"
                  />
                ) : (
                  <div className="text-sm text-gray-500">
                    {file?.updated_at}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-center py-4">No files to view yet</p>
        )}
        <div ref={observerRef} />
      </CardContent>
    </Card>
  );
}

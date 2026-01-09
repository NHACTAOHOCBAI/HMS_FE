"use client";

export function CacheInfoBanner({ generatedAt }: { generatedAt?: string }) {
  if (!generatedAt) return null;
  return (
    <p className="text-center text-xs text-muted-foreground">
      Data cached at {new Date(generatedAt).toLocaleString("vi-VN")}
    </p>
  );
}

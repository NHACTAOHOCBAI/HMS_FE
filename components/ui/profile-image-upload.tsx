"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileImageUploadProps {
  currentImageUrl?: string | null;
  name: string;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function ProfileImageUpload({
  currentImageUrl,
  name,
  onUpload,
  onDelete,
  size = "lg",
  disabled = false,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !disabled) {
        const file = acceptedFiles[0];
        
        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        try {
          setIsUploading(true);
          await onUpload(file);
        } catch (error) {
          // Revert preview on error
          setPreviewUrl(null);
          throw error;
        } finally {
          setIsUploading(false);
          URL.revokeObjectURL(objectUrl);
        }
      }
    },
    [onUpload, disabled]
  );

  const handleDelete = async () => {
    if (onDelete && !disabled) {
      try {
        setIsDeleting(true);
        await onDelete();
        setPreviewUrl(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false,
    disabled: disabled || isUploading,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-full transition-all duration-200",
          isDragActive && "ring-4 ring-primary/50",
          (disabled || isUploading) && "cursor-not-allowed opacity-60"
        )}
      >
        <input {...getInputProps()} />
        
        <Avatar className={cn(sizeClasses[size], "border-4 border-background shadow-lg")}>
          <AvatarImage src={displayUrl || undefined} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-2xl font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
            disabled && "hidden"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          onClick={(e) => {
            e.stopPropagation();
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : "Upload"}
        </Button>

        {displayUrl && onDelete && (
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || isDeleting}
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Drag & drop or click to upload
        <br />
        Max 2MB · JPEG, PNG, WebP
      </p>
    </div>
  );
}

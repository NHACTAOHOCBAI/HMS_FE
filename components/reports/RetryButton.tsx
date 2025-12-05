"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function RetryButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={loading}>
      <RotateCcw className="mr-2 h-4 w-4" />
      {loading ? "Đang tải..." : "Thử lại"}
    </Button>
  );
}

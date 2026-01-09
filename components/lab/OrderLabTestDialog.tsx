"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, Loader2 } from "lucide-react";
import { useActiveLabTests, useCreateLabResult } from "@/hooks/queries/useLab";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { LabTestCategory } from "@/services/lab.service";

interface OrderLabTestDialogProps {
  medicalExamId: string;
  patientId: string;
  patientName: string;
  onSuccess?: () => void;
}

const categoryLabels: Record<LabTestCategory, string> = {
  LAB: "Laboratory",
  IMAGING: "Imaging",
  PATHOLOGY: "Pathology",
};

const categoryColors: Record<LabTestCategory, string> = {
  LAB: "bg-blue-100 text-blue-800",
  IMAGING: "bg-purple-100 text-purple-800",
  PATHOLOGY: "bg-orange-100 text-orange-800",
};

export function OrderLabTestDialog({
  medicalExamId,
  patientId,
  patientName,
  onSuccess,
}: OrderLabTestDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const { data: labTests, isLoading: isLoadingTests } = useActiveLabTests();
  const createLabResult = useCreateLabResult();

  const selectedTest = labTests?.find((t) => t.id === selectedTestId);

  const handleSubmit = async () => {
    if (!selectedTestId) {
      toast.error("Vui lòng chọn loại xét nghiệm");
      return;
    }

    try {
      await createLabResult.mutateAsync({
        medicalExamId,
        labTestId: selectedTestId,
        notes: notes || undefined,
      });

      toast.success("Đã order xét nghiệm thành công!");
      setOpen(false);
      setSelectedTestId("");
      setNotes("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể order xét nghiệm");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FlaskConical className="h-4 w-4" />
          Order Xét nghiệm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-sky-500" />
            Order Xét nghiệm
          </DialogTitle>
          <DialogDescription>
            Đặt xét nghiệm cho bệnh nhân <strong>{patientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="labTest">Loại xét nghiệm *</Label>
            {isLoadingTests ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải danh sách...
              </div>
            ) : (
              <Select value={selectedTestId} onValueChange={setSelectedTestId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại xét nghiệm" />
                </SelectTrigger>
                <SelectContent>
                  {labTests?.map((test) => (
                    <SelectItem key={test.id} value={test.id}>
                      <div className="flex items-center gap-2">
                        <span>{test.name}</span>
                        <Badge
                          variant="secondary"
                          className={categoryColors[test.category]}
                        >
                          {categoryLabels[test.category]}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedTest && (
            <div className="rounded-lg border bg-muted/50 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã:</span>
                <span className="font-medium">{selectedTest.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giá:</span>
                <span className="font-medium text-sky-600">
                  {selectedTest.price?.toLocaleString("vi-VN")} VND
                </span>
              </div>
              {selectedTest.normalRange && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá trị bình thường:</span>
                  <span className="font-medium">{selectedTest.normalRange}</span>
                </div>
              )}
              {selectedTest.description && (
                <div className="pt-2 border-t">
                  <p className="text-muted-foreground">{selectedTest.description}</p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú cho xét nghiệm..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTestId || createLabResult.isPending}
          >
            {createLabResult.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FlaskConical className="mr-2 h-4 w-4" />
                Order Xét nghiệm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

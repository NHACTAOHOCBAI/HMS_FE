"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
  Pill,
  FileText,
  Package,
  Calculator,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getMedicines } from "@/services/medicine.service";
import { Medicine } from "@/interfaces/medicine";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

// Schema matching backend PrescriptionItemRequest
const prescriptionItemSchema = z.object({
  medicineId: z.string().min(1, "Vui lòng chọn thuốc"),
  quantity: z.coerce.number().min(1, "Số lượng tối thiểu là 1"),
  dosage: z.string().min(1, "Vui lòng nhập liều dùng"),
  durationDays: z.coerce.number().min(1, "Số ngày tối thiểu là 1").optional(),
  instructions: z.string().optional(),
});

const prescriptionFormSchema = z.object({
  items: z.array(prescriptionItemSchema).min(1, "Cần ít nhất một loại thuốc"),
  notes: z.string().optional(),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;

interface PrescriptionFormProps {
  onSubmit: (data: PrescriptionFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<PrescriptionFormValues>;
  examId?: string;
  patientName?: string;
  onCancel?: () => void;
  backHref?: string;
}

export function PrescriptionForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  examId,
  patientName,
  onCancel,
  backHref,
}: PrescriptionFormProps) {
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema) as any,
    defaultValues: defaultValues || {
      items: [
        {
          medicineId: "",
          quantity: 1,
          dosage: "",
          durationDays: 7,
          instructions: "",
        },
      ],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Reset form when defaultValues change (for edit mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const { data: medicinesData } = useQuery({
    queryKey: ["medicines-list"],
    queryFn: () => getMedicines({ page: 1, size: 200 }),
  });

  const medicines: Medicine[] = medicinesData?.content || [];
  const [openMedicine, setOpenMedicine] = useState<number | null>(null);

  // Watch items for summary calculation
  const watchedItems = form.watch("items");

  // Calculate order summary
  const orderSummary = useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;
    let itemsWithMedicine: Array<{ name: string; quantity: number; price: number; subtotal: number }> = [];

    watchedItems.forEach((item) => {
      if (item.medicineId) {
        const medicine = medicines.find((m) => m.id.toString() === item.medicineId);
        if (medicine) {
          const quantity = item.quantity || 0;
          const price = medicine.sellingPrice || 0;
          const subtotal = quantity * price;
          totalItems += quantity;
          totalPrice += subtotal;
          itemsWithMedicine.push({
            name: medicine.name,
            quantity,
            price,
            subtotal,
          });
        }
      }
    });

    return { totalItems, totalPrice, itemsWithMedicine };
  }, [watchedItems, medicines]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getMedicineById = (id: string): Medicine | undefined => {
    return medicines.find((m) => m.id.toString() === id);
  };

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-6 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white" />
        </div>

        <div className="relative flex items-start gap-5">
          {backHref && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-white/90 hover:text-white hover:bg-white/20 shrink-0 mt-1"
            >
              <Link href={backHref}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
          
          <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Pill className="h-7 w-7 text-white" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Kê Đơn Thuốc</h1>
            {patientName && (
              <p className="text-white/80 text-sm">
                Bệnh nhân: <span className="font-medium text-white">{patientName}</span>
              </p>
            )}
            {examId && (
              <p className="text-white/60 text-xs font-mono">
                Mã phiếu: {examId.slice(0, 8)}...
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Medicine Items */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3">
                  <h2 className="flex items-center gap-2 text-white font-semibold">
                    <Package className="h-5 w-5" />
                    Danh sách thuốc ({fields.length})
                  </h2>
                </div>
                <CardContent className="p-5 space-y-4">
                  {fields.map((field, index) => {
                    const selectedMedicine = getMedicineById(
                      form.watch(`items.${index}.medicineId`)
                    );

                    return (
                      <div
                        key={field.id}
                        className="rounded-xl border-2 border-slate-200 p-4 bg-slate-50/50 hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <span className="font-medium text-slate-700">
                              {selectedMedicine ? selectedMedicine.name : `Thuốc ${index + 1}`}
                            </span>
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Xóa
                            </Button>
                          )}
                        </div>

                        {/* Medicine Info Badge */}
                        {selectedMedicine && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {formatCurrency(selectedMedicine.sellingPrice)}/{selectedMedicine.unit || "viên"}
                            </Badge>
                            {selectedMedicine.quantity !== undefined && (
                              <Badge
                                variant="outline"
                                className={
                                  selectedMedicine.quantity > 10
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                Tồn: {selectedMedicine.quantity}
                              </Badge>
                            )}
                            {selectedMedicine.activeIngredient && (
                              <Badge variant="secondary">{selectedMedicine.activeIngredient}</Badge>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Medicine Select */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.medicineId`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col md:col-span-2">
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  Chọn thuốc <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover
                                  open={openMedicine === index}
                                  onOpenChange={(open) =>
                                    setOpenMedicine(open ? index : null)
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between h-11 border-2",
                                          !field.value && "text-slate-400 border-slate-300 hover:border-emerald-400",
                                          field.value && "border-emerald-400 bg-emerald-50/50 text-slate-800"
                                        )}
                                      >
                                        {field.value
                                          ? medicines.find(
                                              (m) => m.id.toString() === field.value
                                            )?.name
                                          : "Tìm và chọn thuốc..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[350px] p-0">
                                    <Command>
                                      <CommandInput placeholder="Tìm thuốc theo tên..." />
                                      <CommandList className="max-h-[300px]">
                                        <CommandEmpty>Không tìm thấy thuốc.</CommandEmpty>
                                        <CommandGroup>
                                          {medicines.map((medicine) => (
                                            <CommandItem
                                              value={medicine.name}
                                              key={medicine.id}
                                              onSelect={() => {
                                                form.setValue(
                                                  `items.${index}.medicineId`,
                                                  medicine.id.toString()
                                                );
                                                setOpenMedicine(null);
                                              }}
                                              className="flex items-center justify-between py-3"
                                            >
                                              <div className="flex items-center gap-2">
                                                <Check
                                                  className={cn(
                                                    "h-4 w-4",
                                                    medicine.id.toString() === field.value
                                                      ? "opacity-100 text-emerald-600"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                <div>
                                                  <p className="font-medium">{medicine.name}</p>
                                                  <p className="text-xs text-slate-500">
                                                    {formatCurrency(medicine.sellingPrice)} • Tồn: {medicine.quantity || 0}
                                                  </p>
                                                </div>
                                              </div>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Quantity */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  Số lượng <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      min={1}
                                      {...field}
                                      className="h-11 border-2 pr-12"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                      {selectedMedicine?.unit || "viên"}
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Duration Days */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.durationDays`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  Số ngày dùng
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      min={1}
                                      placeholder="7"
                                      {...field}
                                      className="h-11 border-2 pr-12"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                      ngày
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Dosage */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.dosage`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  Liều dùng <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="VD: 1 viên x 3 lần/ngày, sau ăn"
                                    {...field}
                                    className="h-11 border-2"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Instructions */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.instructions`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  Hướng dẫn sử dụng
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Uống với nhiều nước, tránh ánh nắng..."
                                    {...field}
                                    rows={2}
                                    className="border-2"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Subtotal */}
                        {selectedMedicine && (
                          <div className="mt-4 pt-3 border-t flex justify-end">
                            <span className="text-sm text-slate-500">
                              Thành tiền:{" "}
                              <span className="font-semibold text-emerald-600">
                                {formatCurrency(
                                  (form.watch(`items.${index}.quantity`) || 0) *
                                    (selectedMedicine.sellingPrice || 0)
                                )}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 h-12"
                    onClick={() =>
                      append({
                        medicineId: "",
                        quantity: 1,
                        dosage: "",
                        durationDays: 7,
                        instructions: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm thuốc
                  </Button>
                </CardContent>
              </Card>

              {/* Prescription Notes */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3">
                  <h2 className="flex items-center gap-2 text-white font-semibold">
                    <FileText className="h-5 w-5" />
                    Ghi chú đơn thuốc
                  </h2>
                </div>
                <CardContent className="p-5">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Lời dặn bác sĩ
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tái khám sau 1 tuần, kiêng đồ cay nóng..."
                            {...field}
                            rows={3}
                            className="border-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                {(onCancel || backHref) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-2"
                    onClick={onCancel}
                    asChild={!!backHref}
                  >
                    {backHref ? (
                      <Link href={backHref}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Hủy
                      </Link>
                    ) : (
                      <>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Hủy
                      </>
                    )}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 font-medium text-base"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu đơn thuốc"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-lg sticky top-4">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3">
              <h2 className="flex items-center gap-2 text-white font-semibold">
                <Calculator className="h-5 w-5" />
                Tổng kết đơn thuốc
              </h2>
            </div>
            <CardContent className="p-5">
              {orderSummary.itemsWithMedicine.length > 0 ? (
                <div className="space-y-4">
                  {/* Items List */}
                  <div className="space-y-2">
                    {orderSummary.itemsWithMedicine.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600 truncate max-w-[150px]" title={item.name}>
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium text-slate-800">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Số loại thuốc:</span>
                      <span className="font-medium">{orderSummary.itemsWithMedicine.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tổng số lượng:</span>
                      <span className="font-medium">{orderSummary.totalItems}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold mt-2">
                      <span className="text-slate-700">Tổng tiền:</span>
                      <span className="text-emerald-600">
                        {formatCurrency(orderSummary.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Pill className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>Chưa có thuốc nào</p>
                  <p className="text-sm">Thêm thuốc để xem tổng kết</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Lưu ý</p>
                  <ul className="text-amber-700 space-y-1">
                    <li>• Kiểm tra kỹ tương tác thuốc</li>
                    <li>• Xác nhận dị ứng của bệnh nhân</li>
                    <li>• Ghi rõ liều dùng và thời gian</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

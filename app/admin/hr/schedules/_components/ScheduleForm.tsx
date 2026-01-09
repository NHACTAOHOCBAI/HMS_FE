"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleRequest, Employee } from "@/interfaces/hr";
import { useEmployees } from "@/hooks/queries/useHr";
import { Check, ChevronsUpDown, Calendar, Clock, User, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    employeeId: z.string().min(1, "Vui lòng chọn nhân viên"),
    workDate: z.string().min(1, "Vui lòng chọn ngày"),
    startTime: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
    endTime: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
    status: z.enum(["AVAILABLE", "BOOKED", "CANCELLED"]),
    notes: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const today = new Date();
    const dateVal = new Date(values.workDate);
    if (isFinite(dateVal.getTime())) {
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (dateVal < todayStart) {
        ctx.addIssue({
          code: "custom",
          path: ["workDate"],
          message: "Ngày làm việc không thể trong quá khứ",
        });
      }
    }

    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map((v) => Number(v));
      return h * 60 + m;
    };

    const startMin = toMinutes(values.startTime || "0:0");
    const endMin = toMinutes(values.endTime || "0:0");
    if (startMin >= endMin) {
      ctx.addIssue({
        code: "custom",
        path: ["startTime"],
        message: "Giờ bắt đầu phải trước giờ kết thúc",
      });
    }

    const incrementOk = (min: number) => min % 30 === 0;
    if (!incrementOk(startMin) || !incrementOk(endMin)) {
      ctx.addIssue({
        code: "custom",
        path: ["startTime"],
        message: "Thời gian phải là bội số của 30 phút",
      });
    }
  });

type ScheduleFormValues = z.infer<typeof formSchema>;

interface ScheduleFormProps {
  initialData?: any;
  onSubmit: (data: ScheduleRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export default function ScheduleForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: ScheduleFormProps) {
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: initialData?.employeeId || "",
      workDate: initialData?.workDate || new Date().toISOString().split("T")[0],
      startTime: initialData?.startTime || "09:00",
      endTime: initialData?.endTime || "17:00",
      status: initialData?.status || "AVAILABLE",
      notes: initialData?.notes || "",
    },
  });

  // Fetch employees for combobox
  const { data: employeesData, isLoading: loadingEmployees } = useEmployees({ size: 100, status: "ACTIVE" });
  const employees = employeesData?.content ?? [];

  const handleSubmit = (values: ScheduleFormValues) => {
    onSubmit(values);
  };

  const selectedEmployee = employees.find((emp: Employee) => emp.id === form.watch("employeeId"));

  // Quick time presets
  const timePresets = [
    { label: "Ca sáng", start: "07:00", end: "12:00", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { label: "Ca chiều", start: "13:00", end: "18:00", color: "bg-sky-100 text-sky-700 border-sky-200" },
    { label: "Ca tối", start: "18:00", end: "23:00", color: "bg-violet-100 text-violet-700 border-violet-200" },
    { label: "Cả ngày", start: "08:00", end: "17:00", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  ];

  const applyPreset = (start: string, end: string) => {
    form.setValue("startTime", start);
    form.setValue("endTime", end);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Employee Selection */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-violet-500" />
                Nhân viên <span className="text-red-500">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between h-11 border-2",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {loadingEmployees ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang tải...
                        </span>
                      ) : selectedEmployee ? (
                        <span className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-medium">
                            {selectedEmployee.fullName.charAt(0)}
                          </div>
                          {selectedEmployee.fullName}
                          <span className="text-muted-foreground text-xs">({selectedEmployee.role})</span>
                        </span>
                      ) : (
                        "Chọn nhân viên..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[400px]" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm nhân viên..." />
                    <CommandEmpty>Không tìm thấy nhân viên.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {employees.map((emp: Employee) => (
                        <CommandItem
                          key={emp.id}
                          value={emp.fullName}
                          onSelect={() => field.onChange(emp.id)}
                          className="py-2"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === emp.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-sm font-medium">
                              {emp.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{emp.fullName}</div>
                              <div className="text-xs text-muted-foreground">{emp.role} {emp.departmentName && `• ${emp.departmentName}`}</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date and Status Row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-sky-500" />
                  Ngày làm việc <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="h-11 border-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Trạng thái</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 border-2">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Có thể đặt lịch
                      </span>
                    </SelectItem>
                    <SelectItem value="BOOKED">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-sky-500" />
                        Đã được đặt
                      </span>
                    </SelectItem>
                    <SelectItem value="CANCELLED">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Đã hủy
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quick Time Presets */}
        <div className="space-y-2">
          <FormLabel className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-amber-500" />
            Ca làm nhanh
          </FormLabel>
          <div className="flex flex-wrap gap-2">
            {timePresets.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="outline"
                size="sm"
                className={cn("border-2", preset.color)}
                onClick={() => applyPreset(preset.start, preset.end)}
              >
                {preset.label} ({preset.start}-{preset.end})
              </Button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Giờ bắt đầu <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="time" step={1800} className="h-11 border-2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Giờ kết thúc <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="time" step={1800} className="h-11 border-2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-slate-500" />
                Ghi chú
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ghi chú thêm (tùy chọn)..."
                  className="resize-none border-2"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onCancel} className="px-6">
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
        </div>
      </form>
    </Form>
  );
}

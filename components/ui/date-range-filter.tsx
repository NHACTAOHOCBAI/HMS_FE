"use client";

import { useState, useCallback, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Preset types
type PresetKey = "today" | "yesterday" | "7days" | "30days" | "thisWeek" | "thisMonth" | "custom" | "all";

interface DatePreset {
  key: PresetKey;
  label: string;
  shortLabel?: string;
  getRange: () => { from: Date; to: Date } | null;
}

// Preset definitions
const presets: DatePreset[] = [
  {
    key: "all",
    label: "Tất cả",
    getRange: () => null,
  },
  {
    key: "today",
    label: "Hôm nay",
    getRange: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    key: "yesterday",
    label: "Hôm qua",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    key: "7days",
    label: "7 ngày qua",
    shortLabel: "7 ngày",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    key: "30days",
    label: "30 ngày qua",
    shortLabel: "30 ngày",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    key: "thisWeek",
    label: "Tuần này",
    getRange: () => ({
      from: startOfWeek(new Date(), { locale: vi }),
      to: endOfWeek(new Date(), { locale: vi }),
    }),
  },
  {
    key: "thisMonth",
    label: "Tháng này",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
];

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
  showQuickPresets?: boolean;
  presetKeys?: PresetKey[];
  placeholder?: string;
  align?: "start" | "center" | "end";
  theme?: "default" | "teal" | "indigo" | "purple";
}

const themeColors = {
  default: {
    activeBg: "bg-slate-900",
    activeText: "text-white",
    hoverBg: "hover:bg-slate-100",
    accent: "bg-slate-500",
    border: "border-slate-300",
    focusBorder: "focus:border-slate-500",
    buttonBg: "bg-slate-900",
    buttonHover: "hover:bg-slate-800",
  },
  teal: {
    activeBg: "bg-teal-600",
    activeText: "text-white",
    hoverBg: "hover:bg-teal-50",
    accent: "bg-teal-500",
    border: "border-teal-200",
    focusBorder: "focus:border-teal-500",
    buttonBg: "bg-gradient-to-r from-teal-500 to-cyan-500",
    buttonHover: "hover:from-teal-600 hover:to-cyan-600",
  },
  indigo: {
    activeBg: "bg-indigo-600",
    activeText: "text-white",
    hoverBg: "hover:bg-indigo-50",
    accent: "bg-indigo-500",
    border: "border-indigo-200",
    focusBorder: "focus:border-indigo-500",
    buttonBg: "bg-gradient-to-r from-indigo-500 to-purple-500",
    buttonHover: "hover:from-indigo-600 hover:to-purple-600",
  },
  purple: {
    activeBg: "bg-purple-600",
    activeText: "text-white",
    hoverBg: "hover:bg-purple-50",
    accent: "bg-purple-500",
    border: "border-purple-200",
    focusBorder: "focus:border-purple-500",
    buttonBg: "bg-gradient-to-r from-purple-500 to-pink-500",
    buttonHover: "hover:from-purple-600 hover:to-pink-600",
  },
};

export function DateRangeFilter({
  value,
  onChange,
  className,
  showQuickPresets = true,
  presetKeys = ["all", "today", "7days", "30days", "thisMonth"],
  placeholder = "Chọn khoảng thời gian",
  align = "start",
  theme = "teal",
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("all");
  const [tempRange, setTempRange] = useState<DateRange>({ from: undefined, to: undefined });

  const colors = themeColors[theme];
  const filteredPresets = presets.filter((p) => presetKeys.includes(p.key));

  // Determine active preset based on current value
  useEffect(() => {
    if (!value?.from && !value?.to) {
      setSelectedPreset("all");
      return;
    }

    // Check if current range matches any preset
    const matchingPreset = presets.find((preset) => {
      if (preset.key === "all" || preset.key === "custom") return false;
      const range = preset.getRange();
      if (!range || !value?.from || !value?.to) return false;
      return (
        format(range.from, "yyyy-MM-dd") === format(value.from, "yyyy-MM-dd") &&
        format(range.to, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd")
      );
    });

    setSelectedPreset(matchingPreset?.key || "custom");
  }, [value]);

  const handlePresetClick = useCallback(
    (preset: DatePreset) => {
      setSelectedPreset(preset.key);
      const range = preset.getRange();
      if (range) {
        onChange({ from: range.from, to: range.to });
      } else {
        onChange(undefined);
      }
    },
    [onChange]
  );

  const handleCalendarSelect = useCallback((range: { from?: Date; to?: Date } | undefined) => {
    setTempRange({ from: range?.from, to: range?.to });
  }, []);

  const handleApplyCustomRange = useCallback(() => {
    if (tempRange.from) {
      setSelectedPreset("custom");
      onChange({
        from: startOfDay(tempRange.from),
        to: tempRange.to ? endOfDay(tempRange.to) : endOfDay(tempRange.from),
      });
      setIsOpen(false);
    }
  }, [tempRange, onChange]);

  const handleClear = useCallback(() => {
    setSelectedPreset("all");
    setTempRange({ from: undefined, to: undefined });
    onChange(undefined);
  }, [onChange]);

  const formatDisplayDate = () => {
    if (!value?.from) return null;
    if (!value?.to || format(value.from, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd")) {
      return format(value.from, "dd/MM/yyyy", { locale: vi });
    }
    return `${format(value.from, "dd/MM", { locale: vi })} - ${format(value.to, "dd/MM/yyyy", { locale: vi })}`;
  };

  const displayDate = formatDisplayDate();
  const activePresetLabel = presets.find((p) => p.key === selectedPreset)?.label;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Quick Presets */}
      {showQuickPresets && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {filteredPresets.slice(0, 5).map((preset) => (
            <button
              key={preset.key}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                selectedPreset === preset.key
                  ? `${colors.activeBg} ${colors.activeText} shadow-md scale-[1.02]`
                  : `bg-white text-slate-600 border ${colors.border} ${colors.hoverBg}`
              )}
            >
              {preset.shortLabel || preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

      {/* Custom Date Range Picker */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 px-3 justify-start text-left font-normal border-2 transition-all",
              selectedPreset === "custom"
                ? `${colors.border} ${colors.focusBorder} bg-white ring-2 ring-offset-1 ring-teal-200`
                : `border-slate-200 hover:border-slate-300`,
              !value?.from && "text-slate-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
            {displayDate && selectedPreset === "custom" ? (
              <span className="font-medium text-slate-800">{displayDate}</span>
            ) : (
              <span className="text-slate-500">Tùy chỉnh...</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-xl border-2" align={align}>
          <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-white">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-500" />
              Chọn khoảng thời gian
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              Nhấp vào ngày bắt đầu và ngày kết thúc
            </p>
          </div>

          {/* Calendar with gradient accent */}
          <div className="relative">
            <div className={`absolute top-0 left-0 right-0 h-1 ${colors.buttonBg}`} />
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={tempRange.from || new Date()}
              selected={tempRange}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
              locale={vi}
              className="p-3"
            />
          </div>

          {/* Selected Range Display */}
          {tempRange.from && (
            <div className="px-4 py-3 bg-slate-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">
                    {format(tempRange.from, "dd/MM/yyyy", { locale: vi })}
                  </Badge>
                  <span className="text-slate-400">→</span>
                  <Badge variant="outline" className="bg-white">
                    {tempRange.to
                      ? format(tempRange.to, "dd/MM/yyyy", { locale: vi })
                      : "Chọn ngày kết thúc"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between p-3 border-t bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTempRange({ from: undefined, to: undefined });
              }}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa
            </Button>
            <Button
              size="sm"
              onClick={handleApplyCustomRange}
              disabled={!tempRange.from}
              className={cn(
                colors.buttonBg,
                colors.buttonHover,
                "text-white shadow-md"
              )}
            >
              <Check className="h-4 w-4 mr-1" />
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Badge & Clear Button */}
      {value?.from && (
        <div className="flex items-center gap-2 ml-2">
          <Badge
            variant="secondary"
            className={cn(
              "px-2.5 py-1 font-medium",
              selectedPreset === "custom"
                ? `${colors.activeBg} ${colors.activeText}`
                : "bg-slate-100 text-slate-700"
            )}
          >
            <CalendarIcon className="h-3 w-3 mr-1.5" />
            {selectedPreset === "custom" ? displayDate : activePresetLabel}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Quick presets only (compact version)
export function DatePresetButtons({
  value,
  onChange,
  presetKeys = ["all", "today", "7days", "30days"],
  theme = "teal",
  className,
}: {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  presetKeys?: PresetKey[];
  theme?: "default" | "teal" | "indigo" | "purple";
  className?: string;
}) {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("all");
  const colors = themeColors[theme];
  const filteredPresets = presets.filter((p) => presetKeys.includes(p.key));

  useEffect(() => {
    if (!value?.from && !value?.to) {
      setSelectedPreset("all");
      return;
    }
    const matchingPreset = presets.find((preset) => {
      if (preset.key === "all" || preset.key === "custom") return false;
      const range = preset.getRange();
      if (!range || !value?.from || !value?.to) return false;
      return (
        format(range.from, "yyyy-MM-dd") === format(value.from, "yyyy-MM-dd") &&
        format(range.to, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd")
      );
    });
    setSelectedPreset(matchingPreset?.key || "custom");
  }, [value]);

  const handlePresetClick = (preset: DatePreset) => {
    setSelectedPreset(preset.key);
    const range = preset.getRange();
    if (range) {
      onChange({ from: range.from, to: range.to });
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {filteredPresets.map((preset) => (
        <button
          key={preset.key}
          onClick={() => handlePresetClick(preset)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            selectedPreset === preset.key
              ? `${colors.activeBg} ${colors.activeText} shadow-md`
              : `bg-white text-slate-600 border ${colors.border} ${colors.hoverBg}`
          )}
        >
          {preset.shortLabel || preset.label}
        </button>
      ))}
    </div>
  );
}

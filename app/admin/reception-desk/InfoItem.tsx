import { cn } from "@/lib/utils";

export function Info({
    label,
    value,
    className,
}: {
    label: string;
    value: any;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col gap-0.5", className)}>
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-medium text-sm text-foreground">{value}</span>
        </div>
    );
}

import * as React from "react";

<<<<<<< HEAD
import { cn } from "@/lib/utils";
=======
import { cn } from "./utils";
>>>>>>> repoB/master

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
<<<<<<< HEAD
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-app-primary-blue-500 focus-visible:ring-app-primary-blue-500/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
=======
        // Base styles
        "flex h-10 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-sm text-slate-900",
        // Border and placeholder
        "border-slate-200 placeholder:text-slate-400",
        // Focus states - prominent sky-blue ring
        "focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500",
        // Hover state
        "hover:border-slate-300",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-700",
        // Selection
        "selection:bg-sky-100 selection:text-sky-900",
        // Error state
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/30",
        // Transition
        "transition-colors duration-150",
>>>>>>> repoB/master
        className
      )}
      {...props}
    />
  );
}

export { Input };
<<<<<<< HEAD
=======

>>>>>>> repoB/master

<<<<<<< HEAD
=======
"use client";

>>>>>>> repoB/master
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
<<<<<<< HEAD
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
=======
  "inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
>>>>>>> repoB/master
  {
    variants: {
      variant: {
        default:
<<<<<<< HEAD
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
=======
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-slate-100 text-slate-700",
        destructive:
          "border-transparent bg-red-500 text-white",
        outline:
          "border-slate-200 text-slate-700 bg-white",
        // Semantic variants for status indicators
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700",
        error:
          "border-red-200 bg-red-50 text-red-700",
        info:
          "border-sky-200 bg-sky-50 text-sky-700",
        // Muted versions for less emphasis
        "success-subtle":
          "border-transparent bg-emerald-100/50 text-emerald-600",
        "warning-subtle":
          "border-transparent bg-amber-100/50 text-amber-600",
        "error-subtle":
          "border-transparent bg-red-100/50 text-red-600",
        "info-subtle":
          "border-transparent bg-sky-100/50 text-sky-600",
        // Solid versions for high emphasis
        "success-solid":
          "border-transparent bg-emerald-500 text-white",
        "warning-solid":
          "border-transparent bg-amber-500 text-white",
        "error-solid":
          "border-transparent bg-red-500 text-white",
        "info-solid":
          "border-transparent bg-sky-500 text-white",
>>>>>>> repoB/master
      },
    },
    defaultVariants: {
      variant: "default",
    },
<<<<<<< HEAD
  }
=======
  },
>>>>>>> repoB/master
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
<<<<<<< HEAD
      className={cn(
        badgeVariants({ variant }),
        className,
        "rounded-full px-3 py-1 text-xs font-medium"
      )}
=======
      className={cn(badgeVariants({ variant }), className)}
>>>>>>> repoB/master
      {...props}
    />
  );
}

export { Badge, badgeVariants };
<<<<<<< HEAD
=======

>>>>>>> repoB/master

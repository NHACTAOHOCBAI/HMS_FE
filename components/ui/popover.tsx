<<<<<<< HEAD
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
=======
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";
>>>>>>> repoB/master

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
<<<<<<< HEAD
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
=======
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
>>>>>>> repoB/master
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
<<<<<<< HEAD
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
=======
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
>>>>>>> repoB/master
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
<<<<<<< HEAD
          className
=======
          className,
>>>>>>> repoB/master
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> repoB/master
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
<<<<<<< HEAD
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
=======
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
>>>>>>> repoB/master

<<<<<<< HEAD
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"
=======
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";
>>>>>>> repoB/master

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
<<<<<<< HEAD
      data-slot="separator"
=======
      data-slot="separator-root"
>>>>>>> repoB/master
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
<<<<<<< HEAD
        className
      )}
      {...props}
    />
  )
}

export { Separator }
=======
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
>>>>>>> repoB/master

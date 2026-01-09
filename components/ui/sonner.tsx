<<<<<<< HEAD
"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
=======
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
>>>>>>> repoB/master

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
<<<<<<< HEAD
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
=======
>>>>>>> repoB/master
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
<<<<<<< HEAD
          "--border-radius": "var(--radius)",
=======
>>>>>>> repoB/master
        } as React.CSSProperties
      }
      {...props}
    />
<<<<<<< HEAD
  )
}

export { Toaster }
=======
  );
};

export { Toaster };
>>>>>>> repoB/master

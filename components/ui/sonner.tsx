"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 shrink-0" />
        ),
        info: (
          <InfoIcon className="size-4 shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 shrink-0" />
        ),
        error: (
          <OctagonXIcon className="size-4 shrink-0" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin shrink-0" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans rounded-xl p-4 border",
          title: "font-semibold text-sm leading-snug",
          description: "text-xs font-normal leading-relaxed opacity-90 mt-0.5",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs font-medium",
          success:
            "group-[.toaster]:border-emerald-500/40 group-[.toaster]:bg-emerald-50 dark:group-[.toaster]:bg-emerald-950/90 group-[.toaster]:text-emerald-950 dark:group-[.toaster]:text-emerald-50 [&_[data-description]]:text-emerald-800 dark:[&_[data-description]]:text-emerald-200 [&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400",
          info:
            "group-[.toaster]:border-sky-500/40 group-[.toaster]:bg-sky-50 dark:group-[.toaster]:bg-sky-950/90 group-[.toaster]:text-sky-950 dark:group-[.toaster]:text-sky-50 [&_[data-description]]:text-sky-800 dark:[&_[data-description]]:text-sky-200 [&_[data-icon]]:text-sky-600 dark:[&_[data-icon]]:text-sky-400",
          warning:
            "group-[.toaster]:border-amber-500/40 group-[.toaster]:bg-amber-50 dark:group-[.toaster]:bg-amber-950/90 group-[.toaster]:text-amber-950 dark:group-[.toaster]:text-amber-50 [&_[data-description]]:text-amber-800 dark:[&_[data-description]]:text-amber-200 [&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400",
          error:
            "group-[.toaster]:border-rose-500/40 group-[.toaster]:bg-rose-50 dark:group-[.toaster]:bg-rose-950/90 group-[.toaster]:text-rose-950 dark:group-[.toaster]:text-rose-50 [&_[data-description]]:text-rose-800 dark:[&_[data-description]]:text-rose-200 [&_[data-icon]]:text-rose-600 dark:[&_[data-icon]]:text-rose-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

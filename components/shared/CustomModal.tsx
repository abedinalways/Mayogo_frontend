"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Extend this union + SIZE_CLASSES together — the Record type below
// makes the compiler enforce it, so a new size can't silently fall through.
type Size = "xsm" | "sm" | "md" | "mmd" | "lg" | "xl" | "full";

const SIZE_CLASSES: Record<Size, string> = {
    xsm: "sm:max-w-[460px]",
    sm: "sm:max-w-[384px]",
    md: "sm:max-w-[680px]",
    mmd: "sm:max-w-[684px]",
    lg: "sm:max-w-[918px]",
    xl: "sm:max-w-[1024px]",
    full: "sm:max-w-[min(96vw,1200px)]",
};

type CloseButtonConfig =
  | {
      closeButtonType?: "shadcn";
      closeButtonProps?: React.ComponentProps<typeof DialogClose>;
    }
  | {
      closeButtonType: "custom";
      closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    };

export type CustomModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** Visible heading. Also wired to Radix's aria-labelledby via DialogTitle.
   *  If omitted, a visually-hidden title is still rendered so the dialog
   *  always has an accessible name. */
  title?: React.ReactNode;
  /** Visible sub-text. Wired to aria-describedby via DialogDescription. */
  description?: React.ReactNode;
  size?: Size;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  /** Block closing via outside click / Escape (e.g. mid-submit). */
  preventClose?: boolean;
} & CloseButtonConfig;

function ShadcnCloseButton({
  className,
  ...rest
}: React.ComponentProps<typeof DialogClose>) {
  return (
    <DialogClose
      className={cn(
        "absolute right-0 top-0 rounded-md p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
      {...rest}
    >
      <XIcon className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </DialogClose>
  );
}

function CustomCloseButton({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "absolute right-0 top-0 rounded-full border border-white/10 p-2 transition-colors hover:bg-white/10",
        className,
      )}
      {...rest}
    >
      <XIcon className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </button>
  );
}

export default function CustomModal({
  open,
  onOpenChange,
  children,
  title,
  description,
  size = "md",
  className,
  contentClassName,
  showCloseButton = true,
  preventClose = false,
  ...props
}: CustomModalProps) {
  const closeButton = !showCloseButton ? null : props.closeButtonType ===
    "custom" ? (
    <CustomCloseButton {...props.closeButtonProps} />
  ) : (
    <ShadcnCloseButton {...props.closeButtonProps} />
  );

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (preventClose && !next) return;
                onOpenChange(next);
            }}
        >
            <DialogContent
                showCloseButton={false}
                className={cn(
                    "flex flex-col gap-6 overflow-hidden rounded-2xl bg-white",
                    "p-5",
                    "max-h-[95vh]",
                    SIZE_CLASSES[size],
                    className,
                )}
            >
                {/* Accessible name/description always exist, even when the
                    header row below doesn't render (no visible title, no
                    close button) — the dialog needs a DialogTitle regardless. */}
        {!title && <DialogTitle className="sr-only">Dialog</DialogTitle>}

        {(title || showCloseButton) && (
          <div className="relative flex w-full items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              {title && (
                <DialogTitle className="text-xl font-semibold tracking-tight text-[#0B0B0B] md:text-2xl">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>

            {closeButton}
          </div>
        )}

        {/* Scrollable body */}
        <div
          className={cn(
            "min-h-0 w-full flex-1 overflow-y-auto overscroll-contain",
            "scrollbar-thin",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:bg-[rgba(8,14,30,0.15)]",
            contentClassName,
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

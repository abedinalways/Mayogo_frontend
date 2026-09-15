"use client";

import { useState, type ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DropdownRenderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
};

type Slot = ReactNode | ((props: DropdownRenderProps) => ReactNode);

export type CustomDropdownProps = {
  trigger: Slot;
  children: Slot;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  triggerClassName?: string;
  contentClassName?: string;
  ariaLabel?: string;
  onOpenChange?: (open: boolean) => void;
};

function renderSlot(slot: Slot, props: DropdownRenderProps) {
  return typeof slot === "function" ? slot(props) : slot;
}

export function CustomDropdown({
  trigger,
  children,
  align = "start",
  side = "bottom",
  sideOffset = 8,
  triggerClassName,
  contentClassName,
  ariaLabel,
  onOpenChange,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);

  const api: DropdownRenderProps = {
    open,
    setOpen: (next) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    close: () => {
      setOpen(false);
      onOpenChange?.(false);
    },
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
    >
      <PopoverTrigger aria-label={ariaLabel} className={cn(triggerClassName)}>
        {renderSlot(trigger, api)}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "w-auto border-none bg-transparent p-0 shadow-none ring-0",
          contentClassName,
        )}
      >
        {renderSlot(children, api)}
      </PopoverContent>
    </Popover>
  );
}

export default CustomDropdown;

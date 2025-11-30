"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "@tiny-svg/ui/components/button";
import { ChevronDown } from "lucide-react";
import type React from "react";
import { useLayoutEffect, useRef } from "react";
import { Fade } from "@/components/blur-fade/blur-fade";
import { clamp } from "@/lib/clamp";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

const CollapsibleCard = ({
  className,
  children,
  ...props
}: Collapsible.CollapsibleProps) => (
  <Collapsible.Root
    {...props}
    className={cn(
      "relative flex min-h-14 flex-col overflow-hidden rounded-xl border bg-card",
      className
    )}
  >
    {children}
  </Collapsible.Root>
);

const CollapsibleCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <Collapsible.Trigger asChild>
    <div
      {...props}
      className={cn(
        "absolute inset-x-4 z-20 h-14",
        "flex items-center justify-between gap-2",
        className
      )}
    >
      <Button className="h-8 w-8" size="icon" variant="ghost">
        <ChevronDown className="in-data-[state=closed]:-rotate-90 h-4 w-4 transition-transform duration-200" />
      </Button>
      {children}
    </div>
  </Collapsible.Trigger>
);

const CollapsibleCardTitle: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { title?: string }
> = ({ className, title, children, ...p }) => (
  <div className="group flex min-w-0 flex-1 flex-end items-center gap-2 overflow-hidden">
    <p
      {...p}
      className={cn(
        "min-w-0 truncate text-nowrap text-muted-foreground text-sm",
        className
      )}
    >
      {children}
    </p>
    {title && (
      <CopyButton
        className="opacity-0 group-hover:opacity-100 data-[state=copied]:opacity-100"
        value={title}
      />
    )}
  </div>
);

const CollapsibleCardContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
  const bottomFadeRef = useRef<HTMLDivElement>(null);
  const topFadeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollTop > 0 && topFadeRef.current) {
        topFadeRef.current.style.opacity = "1";
      }
      if (
        contentRef.current.scrollTop + contentRef.current.clientHeight <
          contentRef.current.scrollHeight &&
        bottomFadeRef.current
      ) {
        bottomFadeRef.current.style.opacity = "1";
      }
    }
  }, []);

  const OPACITY_SCROLL_DIVISOR = 15;

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const opacityTop = clamp(
      e.currentTarget.scrollTop / OPACITY_SCROLL_DIVISOR,
      [0, 1]
    );
    if (topFadeRef.current) {
      topFadeRef.current.style.opacity = String(opacityTop);
    }
    const scrollBottom =
      e.currentTarget.scrollHeight -
      e.currentTarget.scrollTop -
      e.currentTarget.clientHeight;
    const opacityBottom = clamp(scrollBottom / OPACITY_SCROLL_DIVISOR, [0, 1]);
    if (bottomFadeRef.current) {
      bottomFadeRef.current.style.opacity = String(opacityBottom);
    }
  }

  return (
    <Collapsible.Content
      className={cn(
        "overflow-hidden",
        "data-[state=open]:animate-collapsible-down",
        "data-[state=closed]:animate-collapsible-up"
      )}
    >
      <div
        {...props}
        className={cn("max-h-[70svh] overflow-auto pt-14 pb-4", className)}
        onScroll={onScroll}
        ref={contentRef}
      />
      <Fade
        background="var(--color-background)"
        blur="4px"
        className="inset-x-0 top-0 z-10 h-17 rounded-t-xl"
        ref={topFadeRef}
        side="top"
        stop="60%"
        style={{
          opacity: 0,
        }}
      />
      <Fade
        background="var(--color-background)"
        blur="2px"
        className="inset-x-0 bottom-0 z-10 h-16 rounded-b-xl"
        ref={bottomFadeRef}
        side="bottom"
        stop="50%"
        style={{
          opacity: 0,
        }}
      />
    </Collapsible.Content>
  );
};

export {
  CollapsibleCard,
  CollapsibleCardHeader,
  CollapsibleCardTitle,
  CollapsibleCardContent,
};

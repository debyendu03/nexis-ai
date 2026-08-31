"use client";

import { X } from "lucide-react";
import clsx from "clsx";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeButtonClassName?: string;
}

export function Modal({
  open,
  onClose,
  children,
  className,
  closeButtonClassName,
}: ModalProps) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ease-out",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={clsx(
          "relative rounded-2xl border border-border bg-sidebar p-4 shadow-2xl transition-all duration-200 ease-out origin-center",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={clsx(
            "absolute -right-8 -top-8 flex h-8.5 w-8.5 items-center justify-center rounded-xl text-content-muted bg-sidebar hover:bg-surface hover:text-content-primary transition-colors cursor-pointer",
            closeButtonClassName,
          )}
        >
          <X className="h-4 w-4" />
        </button>

        {children}
      </div>
    </div>
  );
}
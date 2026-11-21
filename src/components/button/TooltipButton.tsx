import React from "react";
import { Tooltip } from "@pradnyakuswara/ui";

interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltipMessage?: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

export default function TooltipButton({
  disabled,
  tooltipMessage,
  position = "top",
  children,
  className = "",
  onClick,
  ...props
}: TooltipButtonProps) {
  return (
    <Tooltip
      content={tooltipMessage ?? ""}
      placement={position}
      disabled={!disabled || !tooltipMessage}
    >
      <button
        type="button"
        aria-disabled={disabled}
        onClick={onClick}
        className={`${className} ${disabled ? "opacity-50 cursor-not-allowed hover:opacity-50" : ""}`}
        {...props}
      >
        {children}
      </button>
    </Tooltip>
  );
}

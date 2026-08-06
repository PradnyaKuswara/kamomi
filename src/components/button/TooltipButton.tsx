import React, { useState } from "react";

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
  const [showTooltip, setShowTooltip] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return {
          tooltip: "top-full left-1/2 -translate-x-1/2 mt-2 animate-in fade-in slide-in-from-top-1",
          arrow: "absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent border-4"
        };
      case "left":
        return {
          tooltip: "right-full top-1/2 -translate-y-1/2 mr-2 animate-in fade-in slide-in-from-right-1",
          arrow: "absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent border-4"
        };
      case "right":
        return {
          tooltip: "left-full top-1/2 -translate-y-1/2 ml-2 animate-in fade-in slide-in-from-left-1",
          arrow: "absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent border-4"
        };
      case "top":
      default:
        return {
          tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2 animate-in fade-in slide-in-from-bottom-1",
          arrow: "absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent border-4"
        };
    }
  };

  const posClasses = getPositionClasses();

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => disabled && tooltipMessage && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        disabled={disabled}
        onClick={onClick}
        className={`${className} ${
          disabled
            ? "opacity-50 cursor-not-allowed hover:opacity-50"
            : ""
        }`}
        {...props}
      >
        {children}
      </button>

      {disabled && tooltipMessage && showTooltip && (
        <div className={`absolute w-48 p-2 bg-slate-900/95 dark:bg-slate-800/95 text-white text-[10px] rounded-lg shadow-lg z-50 text-center duration-150 font-semibold pointer-events-none border border-slate-200/10 ${posClasses.tooltip}`}>
          {tooltipMessage}
          <div className={posClasses.arrow} />
        </div>
      )}
    </div>
  );
}

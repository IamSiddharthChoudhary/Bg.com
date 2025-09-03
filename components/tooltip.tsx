import React, { useState, ReactNode } from "react";

type TooltipProps = {
  text: string;
  children: ReactNode;
  side?: "right" | "left" | "top" | "bottom";
};

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  side = "right",
}) => {
  const [show, setShow] = useState(false);

  const positionClasses: Record<string, string> = {
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute ${positionClasses[side]} 
            px-3 py-1 bg-black text-white text-sm rounded-md shadow-lg whitespace-nowrap`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

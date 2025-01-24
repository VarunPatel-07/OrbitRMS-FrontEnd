import clsx from "clsx";
import React from "react";

interface ButtonProps {
  Type: "button" | "submit";
  children: React.ReactElement;
  className: string;
  disabled?: boolean;
}

function Button({ Type = "button", children, className, disabled = false }: ButtonProps) {
  return (
    <button
      type={Type}
      className={clsx("disabled:opacity-75 disabled:cursor-not-allowed", className)}
      disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;

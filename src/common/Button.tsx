import React from "react";

function Button({ children, className }: { children: React.ReactElement; className: string }) {
  return <button className={className}>{children}</button>;
}

export default Button;

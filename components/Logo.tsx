
import Image from "next/image";
import type { CSSProperties } from "react";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  theme?: "light" | "dark" | "inherit";
};

export default function Logo({
  className = "",
  width = 240,
  height = 78,
  priority = false,
  theme = "inherit",
}: LogoProps) {
  const themeClass =
    theme === "light"
      ? "logo-light"
      : theme === "dark"
        ? "logo-dark"
        : "";

  return (
    <Image
      src="/logo.svg"
      alt="MAV X Frames"
      width={width}
      height={height}
      priority={priority}
      className={`brand-logo ${themeClass} ${className}`.trim()}
      style={
        {
          "--logo-width": `${width}px`,
          "--logo-height": `${height}px`,
        } as CSSProperties
      }
    />
  );
}

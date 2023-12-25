import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface LinkProps {
  className?: string;
  href: string;
  children?: ReactNode;
}

export function Link(props: LinkProps) {
  return (
    <a
      href={props.href}
      className={cn("text-primary hover:underline", props.className)}
    >
      {props.children}
    </a>
  );
}
export default Link;

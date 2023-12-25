import { links } from "@/components/menu/header-desktop";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import type { HTMLAttributes } from "react";

export function HeaderMobile(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <nav>
      <Sheet>
        <SheetTrigger asChild className={props.className}>
          <Button size="icon" variant="ghost" className="px-2">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <ul role="navigation">
            {links.map((link) => (
              <li key={link.title}>
                <a href={link.href} className={navigationMenuTriggerStyle()}>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

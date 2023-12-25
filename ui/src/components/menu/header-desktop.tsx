import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { HTMLAttributes } from "react";

export const links = [
  { title: "CarApi", href: "/" },
  { title: "Documentation", href: "/docs" },
  { title: "Examples", href: "/example" },
];

export function HeaderDesktop(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <NavigationMenu className={props.className}>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.title}>
            <NavigationMenuLink
              href={link.href}
              className={navigationMenuTriggerStyle()}
            >
              {link.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

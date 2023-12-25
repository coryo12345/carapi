import { HeaderDesktop } from "@/components/menu/header-desktop";
import { HeaderMobile } from "@/components/menu/header-mobile";

export function GlobalMenu() {
  return (
    <header className="border-b px-4 py-2">
      <HeaderDesktop className="hidden md:block" />
      <HeaderMobile className="block md:hidden" />
    </header>
  );
}

export default GlobalMenu;

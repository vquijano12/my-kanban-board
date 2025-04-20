import { useState } from "react";

export function useMenus() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuKey) => {
    setOpenMenu((prevMenu) => (prevMenu === menuKey ? null : menuKey));
  };

  const closeMenu = () => setOpenMenu(null);

  return {
    openMenu,
    setOpenMenu,
    toggleMenu,
    closeMenu,
  };
}

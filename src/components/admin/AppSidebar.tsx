"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/contexts/SidebarContext";

import GridIcon from "@/components/icons/GridIcon";
import CalenderIcon from "@/components/icons/CalenderIcon";
import UserCircleIcon from "@/components/icons/UserCircleIcon";
import ListIcon from "@/components/icons/ListIcon";
import TableIcon from "@/components/icons/TableIcon";
import PageIcon from "@/components/icons/PageIcon";
import PieChartIcon from "@/components/icons/PieChartIcon";
import BoxCubeIcon from "@/components/icons/BoxCubeIcon";
import PlugInIcon from "@/components/icons/PlugInIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import HorizontaLDots from "@/components/icons/HorizontaLDots";
import { ChatIcon } from "@/components/icons/ChatIcon";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    name: "Categories",
    icon: <ListIcon />,
    subItems: [
      { name: "List", path: "/admin/categories", pro: false },
      { name: "Create", path: "/admin/categories/create", pro: false },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Products",
    subItems: [
      { name: "List", path: "/admin/products", pro: false },
      { name: "Create", path: "/admin/products/create", pro: false },
    ],
  },
  {
    icon: <ChatIcon />,
    name: "Chat",
    path: "/admin/chat",
  },
  {
    icon: <UserCircleIcon />,
    name: "Customers",
    path: "/admin/customers",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Orders",
    path: "/admin/orders",
  },
  {
    icon: <PlugInIcon />,
    name: "Coupons",
    subItems: [
      { name: "List", path: "/admin/coupons", pro: false },
      { name: "Create", path: "/admin/coupons/create", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Reviews",
    path: "/admin/reviews",
  },
];

const othersItems: NavItem[] = [];
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others",
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-sm group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-[#ecf3ff] text-primary dark:bg-[#465fff]/[0.12] dark:text-primary"
                  : "text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "text-primary dark:text-primary"
                    : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-[#465fff]"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-sm group ${
                  isActive(nav.path)
                    ? "bg-[#ecf3ff] text-primary dark:bg-[#465fff]/[0.12] dark:text-primary"
                    : "text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "text-primary dark:text-primary"
                      : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-theme-sm font-medium ${
                        isActive(subItem.path)
                          ? "bg-[#ecf3ff] text-primary dark:bg-[#465fff]/[0.12] dark:text-[#7592ff]"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "bg-[#dde9ff] dark:bg-[#465fff]/20"
                                : "bg-[#ecf3ff] group-hover:bg-[#dde9ff] dark:bg-[#465fff]/15 dark:group-hover:bg-[#465fff]/20"
                            } block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase text-[#465fff] dark:text-[#7592ff]`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "bg-[#dde9ff] dark:bg-[#465fff]/20"
                                : "bg-[#ecf3ff] group-hover:bg-[#dde9ff] dark:bg-[#465fff]/15 dark:group-hover:bg-[#465fff]/20"
                            } block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase text-[#465fff] dark:text-[#7592ff]`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-secondary dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 flex justify-center">
        <Link href="/admin/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2 order-1 md:order-none">
              <Image
                className="w-full rounded-full"
                src="/logo_2.jpg"
                alt="Logo"
                width={48}
                height={48}
              />
              <span className="text-lg font-semibold tracking-widest">
                RICONSPORT
              </span>
            </div>
          ) : (
            <Image
              src="/logo_2.jpg"
              className="rounded-full"
              alt="Logo"
              width={48}
              height={48}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

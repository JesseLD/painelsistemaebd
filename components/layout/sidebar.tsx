"use client";
import { IconType } from "react-icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { ButtonWithIcon } from "../ui/buttonWithIcon";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { motion } from "framer-motion";

// import { Pag2e } from "@/app/testcomponents/page";
import { FiUsers } from "react-icons/fi";
type SidebarItemsAttributes = {
  icon: IconType;
  text: string;
  isActive: boolean;
  href: string;
};

const sidebarItems: SidebarItemsAttributes[] = [
  {
    icon: MdOutlineSpaceDashboard,
    text: "Dashboard",
    isActive: false,
    href: "/dashboard",
  },
  {
    icon: BsCashCoin,
    text: "Planos",
    isActive: false,
    href: "/dashboard/plans/list",
  },
  {
    icon: FiUsers,
    text: "Usuários",
    isActive: false,
    href: "/dashboard/users/list",
  },
];
const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
};
export const Sidebar = () => {
  // const location = location.href;
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <>
      <div
        className={`${open ? "mr-20 md:mr-60" : "mr-16"} relative h-screen bg-white`}
      >
        {open == true ? (
          <div className="fixed top-12 z-10 h-screen w-[60px] bg-white md:w-[240px] ">
            <div className="hidden w-[80px] justify-end px-6 pt-12 md:flex md:w-[240px] md:px-4">
              <TbLayoutSidebarLeftCollapse
                color="gray"
                className="hover:cursor-pointer"
                size={24}
                onClick={() => {
                  setOpen(false);
                }}
              />
            </div>
            <ul className="flex flex-col gap-2 pl-2 pt-12 md:pl-8 md:pt-4 ">
              {sidebarItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <ButtonWithIcon
                    icon={item.icon}
                    text={item.text}
                    isActive={pathname == item.href ? true : false}
                    collapsed={true}
                  />
                </Link>
              ))}
            </ul>
          </div>
        ) : (
          <div className="fixed top-12 z-10 h-screen w-[60px] bg-white">
            <div className="hidden w-[60px] justify-end px-2 pt-12 md:flex">
              <TbLayoutSidebarLeftCollapse
                color="gray"
                size={24}
                className="rotate-180 hover:cursor-pointer"
                onClick={() => {
                  setOpen(true);
                }}
              />
            </div>
            <ul className="flex flex-col gap-2 pt-12 md:pl-2 md:pt-4 ">
              {sidebarItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <ButtonWithIcon
                    icon={item.icon}
                    text={item.text}
                    isActive={pathname == item.href ? true : false}
                  />
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

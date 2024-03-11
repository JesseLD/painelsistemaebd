"use client";
import { IconType } from "react-icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import { ButtonWithIcon } from "../ui/buttonWithIcon";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
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
  }
];

export const Sidebar = () => {
  // const location = location.href;
  const router = useRouter();

  const pathname = usePathname();

  return (
    <>
      <div className="h-screen fixed z-10 w-[80px] md:w-[240px] bg-white top-12">
        <ul className="flex flex-col gap-2 pl-4 md:pl-8 pt-12 ">
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
    </>
  );
};

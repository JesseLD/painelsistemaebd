"use client";
import { IconType } from "react-icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import { ButtonWithIcon } from "../ui/buttonWithIcon";

import { MdOutlineSpaceDashboard } from "react-icons/md";

// import { Pag2e } from "@/app/testcomponents/page";

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
    icon: MdOutlineSpaceDashboard,
    text: "Teste",
    isActive: false,
    href: "/testcomponents",
  },
];

export const Sidebar = () => {
  // const location = location.href;
  const router = useRouter();

  const pathname = usePathname();

  return (
    <>
      <div className="h-screen w-[240px] bg-white ">
        <ul className="flex flex-col gap-2 pl-8 pt-12">
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

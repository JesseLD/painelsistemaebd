"use client";

import { IoLogOutOutline } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import { Dropdown } from "flowbite-react";

type Props = {
  name: string;
};

export const LoggedUser = ({ name }: Props) => {
  return (
    <>
      <div className="flex h-[56px] items-center gap-2 bg-white">
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-800 text-xl text-white">
          <p>{name[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <span>{name.length > 16 ? `${name.slice(0,16)}...` : name }</span>
          <span>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span>
                  <FaCaretDown id="icon" color="#999999" />
                </span>
              )}
            >
              <Dropdown.Item>Dashboard</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item>
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown>
            {/* <FaCaretDown color="#999999"/> */}
          </span>
        </div>

        <div className="ml-2">
          <IoLogOutOutline color="#999999" size={32} />
        </div>
      </div>
    </>
  );
};

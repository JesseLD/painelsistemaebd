"use client";

import { IoLogOutOutline } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import { Dropdown } from "flowbite-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HiMiniBars3 } from "react-icons/hi2";
import { toast, ToastContainer } from "react-toastify";

type Props = {
  name: string;
};

export const LoggedUser = ({ name }: Props) => {
  const router = useRouter();

  return (
    <>
      <div className="hidden h-[56px] items-center gap-2 md:flex">
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-800 text-xl text-white ">
          <p>{name[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <span>{name.length > 16 ? `${name.slice(0, 16)}...` : name}</span>
          <span>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="hover:cursor-pointer">
                  <FaCaretDown id="icon" color="#777" />
                </span>
              )}
            >
              <Dropdown.Item
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                Dashboard
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  router.push("/dashboard/users/profile");
                }}
              >
                Perfil
              </Dropdown.Item>
              <Dropdown.Item>
                <span
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sair
                </span>
              </Dropdown.Item>
            </Dropdown>
          </span>
        </div>

        <div className="ml-2 transition hover:cursor-pointer">
          <span
            onClick={() => {
              toast.success("Saindo...");
              setTimeout(() => {
                signOut();
              }, 1000);
            }}
          >
            <IoLogOutOutline color="#777" size={32} />
          </span>
        </div>
      </div>

      <div className="block md:hidden">
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <span className="hover:cursor-pointer">
              <HiMiniBars3 size={32} color="#777" />
            </span>
          )}
        >
          <Dropdown.Item>
            <h1 className="rounded-lg bg-slate-200 p-2">
              {name.length > 16 ? `${name.slice(0, 16)}...` : name}
            </h1>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              router.push("/dashboard/users/profile");
            }}
          >
            Perfil
          </Dropdown.Item>
          <Dropdown.Item>
            <span
              onClick={() => {
                toast.success("Saindo...");
                setTimeout(() => {
                  signOut();
                }, 1000);
              }}
            >
              Sair
            </span>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </>
  );
};

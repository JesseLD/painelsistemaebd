"use client";

import Image from "next/image";
import logo from "../../../public/logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
const Page = () => {
  const router = useRouter();
  const [state, serState] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    const response = await signIn("credentials", {
      redirect: false,
      email: state.email,
      password: state.password,
    });

    // alert("response", response);
    // console.log("LOGIN RESPONSE", response);
    if (response?.ok == true) {
      toast.success("Logado com sucesso");
      toast.info("Redirecionando...");
      setTimeout(() => {
        location.reload();
      }, 1000);
      // router.push("/dashboard");
      // reload()
    } else {
      toast.error("Email ou senha incorretos");
    }
  }

  return (
    <>
      <div className="grid h-screen w-full place-items-center bg-orange-100 ">
        <form
          onSubmit={handleSubmit}
          method="POST"
          className=" max-lg mx-auto flex h-[500px] w-[330px] flex-col items-center justify-center rounded-xl bg-white p-8 md:w-[400px] "
        >
          <div className="group relative z-0 mb-5 flex w-full flex-col items-center ">
            <Image src={logo} alt="" width={128} />
          </div>
          <div className="group relative z-0 mb-6 flex w-full flex-col items-center">
            <h1 className="text-2xl font-bold text-neutral-600">
              Acesse sua Conta
            </h1>
          </div>

          <Input
            name="email"
            type="email"
            text="Email"
            onChange={(e: any) => {
              serState({ ...state, email: e.target.value });
            }}
          />
          <Input
            name="password"
            type="password"
            text="password"
            onChange={(e: any) => {
              serState({ ...state, password: e.target.value });
            }}
          />

          <Button text="Entrar" type="submit" revertColor={false} />
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;

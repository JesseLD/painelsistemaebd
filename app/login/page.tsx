import Image from "next/image";
import logo from "../../public/logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <>
      <div className="grid h-screen w-full place-items-center bg-orange-100 ">
        <form className=" max-lg mx-auto flex h-[500px] w-[330px] flex-col items-center justify-center rounded-xl bg-white p-8 md:w-[400px] ">
          <div className="group relative z-0 mb-5 flex w-full flex-col items-center ">
            <Image src={logo} alt="" width={128} />
          </div>
          <div className="group relative z-0 mb-6 flex w-full flex-col items-center">
            <h1 className="text-2xl font-bold text-neutral-600">
              Acesse sua Conta
            </h1>
          </div>

          <Input name="email" type="email" text="Email" />
          <Input name="password" type="password" text="password" />

          <Button text="Entrar" type="submit" revertColor={false} />
        </form>
      </div>
    </>
  );
};

export default Page;

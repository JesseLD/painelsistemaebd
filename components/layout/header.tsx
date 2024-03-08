import Image from "next/image";
import logoOrange from "../../public/logo.png";
import { LoggedUser } from "../ui/loggedUser";

type Props = {
  pageName: string;
  userName: string;
};

export const Header = ({ pageName, userName }: Props) => {
  return (
    <header className="fixed z-20 flex h-[80px] w-full items-center justify-between bg-white px-6">
      <div className="flex w-full max-w-[360px] items-center justify-between ">
        <Image src={logoOrange} alt="" width={120} className="pl-2 " />
        <h1 className="text-2xl font-bold text-neutral-800 hidden md:block">{pageName}</h1>
      </div>
      <div className="mr-6">
        <LoggedUser name={userName} />
      </div>
    </header>
  );
};
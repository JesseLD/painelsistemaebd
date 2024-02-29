import Image from "next/image";
import Logo from "../public/icon.png";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center md:w-auto">
      <Image src={Logo} width={200} alt={""} className="rounded-[50%]" />
      <h1 className="mt-12 text-2xl font-bold text-neutral-500 md:text-3xl lg:text-6xl ">
        Em desenvolvimento...
      </h1>
    </main>
  );
}

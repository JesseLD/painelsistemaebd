import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
// import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { usePathname } from "next/navigation";
// import { navi }
const inter = Inter({ subsets: ["latin"] });
import { ToastContainer } from "react-toastify";
import { Globals } from "@/app/utils/globals";
import Transition from "@/components/ui/transition";

export const metadata: Metadata = {
  title: "Painel Sistema EBD",
  description: "Painel de gerenciamento do aplicativo do Sistema EBD",
};

// export default function protectedPage

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (!session) {
    return redirect("/login");
  }
  else if (session && session.expires && session.expires < Date.now().toString()) {
    return redirect("/login");
  }
  // console.log("session", session);
  

  Globals.loggedUserEmail = session?.user?.email || "Error";
  // console.log("Globals.loggedUserEmail", Globals.loggedUserEmail);
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <input type="hidden" name="loggedEmail"  id="loggedEmail" value={session.user?.email?.toString()}/>
        <Header
          pageName="Dashboard"
          userName={session?.user?.name || "Error"}
        />
        <div className="flex">
          <div>
            <Sidebar />
          </div>
          <Transition>
            <div className="ml-20 md:ml-60 mt-20 w-full p-6">{children}</div>
          </Transition>
        </div>
      </body>
    </html>
  );
}

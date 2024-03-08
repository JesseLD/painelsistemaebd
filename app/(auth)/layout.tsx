import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Page from "./login/page";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
const LoginLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const session = await getServerSession();

  // console.log("[LOGIN]: ",session)
  if(session){
    return redirect("/dashboard");
  
  }
  return (
    <html lang="pt-br">
      <body>
        <Page />
      </body>
    </html>
  );
};

export default LoginLayout;

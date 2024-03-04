import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Page from "./login/page";
const LoginLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="pt-br">
      <body>
        <Page />
      </body>
    </html>
  );
};

export default LoginLayout;

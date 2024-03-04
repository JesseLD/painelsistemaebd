import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Painel Sistema EBD",
  description: "Painel de gerenciamento do aplicativo do Sistema EBD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
      <Header pageName="Dashboard" userName="Jessé Oliveira" />
        <div className="flex">
          <div>
            <Sidebar />
          </div>
          <div className="p-6">{children}</div>
        </div>
      </body>
    </html>
  );
}

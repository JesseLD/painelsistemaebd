"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  // useEffect(() => {
  //   // Redireciona para a página de login quando o componente monta
  //   router.push("/dashboard");
  // });

  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/Login";

  return (
    <>
      <Header />
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
}

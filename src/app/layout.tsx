"use client"

import { usePathname } from "next/navigation"
import "./globals.css";
import { Header } from "../componentes/header"
import { Footer } from "../componentes/footer"
import { CarrinhoProvider } from "@/Context/carrinhoContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const pathname = usePathname();
   const isLoginPage = pathname === "/Login";

  return (
    <html lang="en">
      
      <title>Celebraí</title>
      <link rel="icon" href="/Vector.svg" />
      
      <body
        className={`antialiased`}
      >

        <CarrinhoProvider>
          <Header />
          {children}
          {!isLoginPage && <Footer />}
        </CarrinhoProvider>

      </body>
    </html>
  );
}

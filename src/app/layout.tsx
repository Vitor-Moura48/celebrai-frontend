"use client"

import { usePathname } from "next/navigation"
import "./globals.css";
import { Header } from "../componentes/header"
import { Footer } from "../componentes/footer"
import { CarrinhoProvider } from "@/Context/carrinhoContext";
import { AuthProvider } from "@/Context/authContext"; // ← ADICIONAR

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
      
      <body className={`antialiased`}>
        <AuthProvider>
          <CarrinhoProvider>
            <Header />
            {children}
            {!isLoginPage && <Footer />}
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
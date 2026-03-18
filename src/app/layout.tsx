"use client"

import { usePathname } from "next/navigation"
import "./globals.css";
import { Header } from "../componentes/header"
import { Footer } from "../componentes/footer"
import { CarrinhoProvider } from "@/Context/carrinhoContext";
import { AuthProvider } from "@/Context/authContext"; 
import { GoogleOAuthProvider } from '@react-oauth/google'; // ← ADICIONAR

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
   28   <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            <CarrinhoProvider>
              <Header />
              {children}
              {!isLoginPage && <Footer />}
            </CarrinhoProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
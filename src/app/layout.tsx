"use client"
import { usePathname } from "next/navigation"
import "./globals.css";
import { Header } from "../componentes/header"
import { Footer } from "../componentes/footer"

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

        <Header/>
        
        {children}

         {!isLoginPage && <Footer />}

      </body>
    </html>
  );
}

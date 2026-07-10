import "./globals.css";
import { Providers } from "../componentes/Providers";
import { LayoutWrapper } from "../componentes/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      
      <title>Celebraí</title>
      <link rel="icon" href="/Vector.svg" />
      
      <body className={`antialiased`}>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
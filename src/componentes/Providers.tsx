"use client";

import { CarrinhoProvider } from "@/Context/carrinhoContext";
import { AuthProvider } from "@/Context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <CarrinhoProvider>
          {children}
        </CarrinhoProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

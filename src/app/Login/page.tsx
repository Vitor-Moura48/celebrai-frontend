"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoginCard from "@/componentes/Login/Card_Login";
import RegisterCard from "@/componentes/Login/Card_Registro";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isRegister, setIsRegister] = useState(mode === "register");

  // Sincroniza o estado toda vez que a URL mudar 
  useEffect(() => {
    setIsRegister(mode === "register");
  }, [mode]);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image 1.png')" }}
    >
      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-[90%] max-w-md text-center text-white shadow-lg border border-white/20 mt-16">
        {isRegister ? <RegisterCard /> : <LoginCard />}

        {/* Alternar entre login e registro */}
        <p
          className="text-sm text-white/70 mt-4 cursor-pointer hover:underline"
          
          // atualiza a página com a nova url
          onClick={() => {
            if (isRegister) 
              router.replace("/Login");
            else 
              router.replace("/Login?mode=register"); 
          }}
        >
          {isRegister
            ? "Já possui uma conta? Faça login"
            : "Não tem uma conta? Registrar-se"}
        </p>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}

"use client";

import { useState, Suspense } from "react";
import LoginCard from "@/componentes/Login/Card_Login";
import RegisterCard from "@/componentes/Login/Card_Registro";

function LoginContent() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image 1.png')" }}
    >
      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-[90%] max-w-md text-center text-white shadow-lg border border-white/20">
        {isRegister ? <RegisterCard /> : <LoginCard />}

        {/* Alternar entre login e registro */}
        <p
          className="text-sm text-white/70 mt-4 cursor-pointer hover:underline"
          onClick={() => setIsRegister(!isRegister)}
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

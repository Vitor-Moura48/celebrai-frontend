"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginCard() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-1">
        Acesse a sua conta <span className="text-[#ff007f]">Celebrai</span>!
      </h1>

      <form className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Informe seu E-mail..."
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
        />

        <button
          type="submit"
          className="w-full bg-[#ff007f] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Continuar
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-white/30 flex-1"></div>
          <span className="text-white/70 text-xs">ou</span>
          <div className="h-px bg-white/30 flex-1"></div>
        </div>

        <button
          onClick={() => alert('Login com Google ainda não implementado')}
          disabled={loading || sucesso}
          className="w-full bg-white/20 border border-white/40 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-white/30 transition disabled:opacity-50"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium">Continuar com o Google</span>
        </button>
      </div>

      {/* Credenciais de teste */}
      <div className="mt-6 bg-white/10 border border-white/20 rounded-lg p-3 text-xs text-white/80">
        <p className="font-semibold mb-2">🔑 Credenciais de teste:</p>
        <div className="space-y-1">
          <p><strong>Fornecedor:</strong> fornecedor@celebrai.com / 123456</p>
          <p><strong>Consumidor:</strong> consumidor@celebrai.com / 123456</p>
          <p><strong>Admin:</strong> admin@celebrai.com / admin123</p>
        </div>
      </div>

      <p className="text-xs text-white/60 mt-4 leading-snug">
        Ao continuar, você concorda com os{" "}
        <span className="underline">Termos de Uso</span> e a{" "}
        <span className="underline">Política de Privacidade</span> da Celebrai,
        e em receber comunicações da Celebrai.
      </p>
    </>
  );
}
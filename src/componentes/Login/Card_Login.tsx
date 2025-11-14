"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useCarrinho } from "@/Context/carrinhoContext";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { limparCarrinho } = useCarrinho();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simula login bem-sucedido
      localStorage.setItem("userLoggedIn", "true");
      limparCarrinho();
      // Redireciona para home com flag de sucesso
      router.push("/?compraRealizada=true");
    }
  };
  return (
    <>
      <h1 className="text-2xl font-semibold mb-1">
        Acesse a sua conta <span className="text-[#ff007f]">Celebrai</span>!
      </h1>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Informe seu E-mail..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
          required
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
          type="button"
          className="w-full bg-white/20 border border-white/40 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-white/30 transition"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium">Continuar com o Google</span>
        </button>
      </form>

      <p className="text-xs text-white/60 mt-4 leading-snug">
        Ao continuar, você concorda com os{" "}
        <span className="underline">Termos de Uso</span> e a{" "}
        <span className="underline">Política de Privacidade</span> da Celebrai,
        e em receber comunicações da Celebrai.
      </p>
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useCarrinho } from "@/Context/carrinhoContext";

export default function RegisterCard() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cpf: "",
    phone: "",
    birthDate: "",
    cep: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const { limparCarrinho } = useCarrinho();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.email &&
      formData.password &&
      formData.password === formData.confirmPassword &&
      formData.firstName &&
      formData.lastName
    ) {
      // Simula registro bem-sucedido
      localStorage.setItem("userLoggedIn", "true");
      limparCarrinho();
      // Redireciona para home com flag de sucesso
      router.push("/?compraRealizada=true");
    }
  };
  return (
    <>
      <h1 className="text-2xl font-semibold mb-1">
        Crie sua conta <span className="text-[#ff007f]">Celebrai</span>!
      </h1>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-1/2 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
            required
          />
          <input
            type="text"
            placeholder="Sobrenome"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-1/2 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
            required
          />
        </div>

        <input
          type="text"
          placeholder="CPF"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
        />

        <input
          type="tel"
          placeholder="Número de telefone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
        />

        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
        />

        <input
          type="text"
          placeholder="CEP"
          value={formData.cep}
          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
        />

        <input
          type="email"
          placeholder="Informe seu E-mail..."
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
          required
        />

        <input
          type="password"
          placeholder="Confirme a senha"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#ff007f] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Registrar-se
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

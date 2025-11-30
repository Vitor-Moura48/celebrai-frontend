"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import authService from "@/lib/api/services/authService";

export default function LoginCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);

      // Token já foi salvo automaticamente pelo authService
      console.log("Login bem-sucedido:", response);

      // Redirecionar para home ou dashboard
      router.push("/");

    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-1">
        Acesse a sua conta <span className="text-[#ff007f]">Celebrai</span>!
      </h1>

      {error && (
        <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Informe seu E-mail..."
          required
          disabled={loading}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          placeholder="Senha"
          required
          disabled={loading}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff007f] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Continuar"}
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

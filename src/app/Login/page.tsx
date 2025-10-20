"use client"

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/image 1.png')",
      }}
    >
      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-[90%] max-w-md text-center text-white shadow-lg border border-white/20">
        <h1 className="text-2xl font-semibold mb-1">
          {isRegister ? "Crie sua conta" : "Acesse a sua conta"}{" "}
          <span className="text-[#ff007f]">Celebrai</span>!
        </h1>

        <form className="mt-6 space-y-4">
          {isRegister && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-1/2 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
                />
                <input
                  type="text"
                  placeholder="Sobrenome"
                  className="w-1/2 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
                />
              </div>

              <input
                type="text"
                placeholder="CPF"
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
              />

              <input
                type="tel"
                placeholder="Número de telefone"
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
              />

              <input
                type="date"
                placeholder="Data de nascimento"
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
              />

              <input
                type="text"
                placeholder="CEP"
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
              />
            </>
          )}

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

          {isRegister && (
            <input
              type="password"
              placeholder="Confirme a senha"
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
            />
          )}

          <button
            type="submit"
            className="w-full bg-[#ff007f] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {isRegister ? "Registrar-se" : "Continuar"}
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
            <span className="text-sm font-medium">
              Continuar com o Google
            </span>
          </button>
        </form>

        <p className="text-xs text-white/60 mt-4 leading-snug">
          Ao continuar, você concorda com os{" "}
          <span className="underline">Termos de Uso</span> e a{" "}
          <span className="underline">Política de Privacidade</span> da
          Celebrai, e em receber comunicações da Celebrai.
        </p>

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

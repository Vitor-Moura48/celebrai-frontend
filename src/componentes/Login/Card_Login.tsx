"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from "@/Context/authContext";

export default function LoginCard() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, senha, 'consumidor');

      if (success) {
        setSucesso(true);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setErro('Email ou senha incorretos');
      }
    } catch (error: any) {
      console.error("❌ Erro no login:", error);

      let mensagemErro = "Erro ao fazer login. Tente novamente.";

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        mensagemErro = error.response.data.errors.join(", ");
      } else if (error.response?.data?.message) {
        mensagemErro = error.response.data.message;
      } else if (error.response?.status === 401) {
        mensagemErro = "Email ou senha incorretos";
      }

      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Informe seu E-mail..."
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] text-white"
          disabled={loading || sucesso}
          required
        />

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Senha"
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] text-white"
          disabled={loading || sucesso}
          required
        />

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm font-medium">{erro}</p>
          </div>
        )}

        {/* Mensagem de sucesso */}
        {sucesso && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
            <p className="text-green-200 text-sm font-medium">Login realizado com sucesso!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || sucesso}
          className="w-full bg-[#ff007f] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Entrando...
            </>
          ) : sucesso ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Redirecionando...
            </>
          ) : (
            'Continuar'
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-white/30 flex-1"></div>
          <span className="text-white/70 text-xs">ou</span>
          <div className="h-px bg-white/30 flex-1"></div>
        </div>

        <button
          type="button"
          onClick={() => alert('Login com Google ainda não implementado')}
          disabled={loading || sucesso}
          className="w-full bg-white/20 border border-white/40 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-white/30 transition disabled:opacity-50"
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
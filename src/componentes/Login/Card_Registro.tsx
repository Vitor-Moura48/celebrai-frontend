"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import authService from "@/lib/api/services/authService";

export default function RegisterCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    cep: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Preparar dados para o backend (formato esperado pela API C#)
      const registroData = {
        nome: `${formData.nome} ${formData.sobrenome}`,
        email: formData.email,
        senha: formData.senha,
        cpfUsuario: formData.cpf.replace(/\D/g, ""), // Remove formatação
        celular: formData.telefone.replace(/\D/g, ""), // Remove formatação
        dataNascimento: formData.dataNascimento,
        cep: formData.cep.replace(/\D/g, ""), // Remove formatação
      };

      console.log("📤 Dados enviando para o backend:", registroData);
      const response = await authService.registrar(registroData);
      console.log("✅ Cadastro bem-sucedido:", response);

      setSuccess("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.");

      // Aguardar 2 segundos e redirecionar para login
      setTimeout(() => {
        window.location.reload(); // Recarrega para mostrar o Card_Login
      }, 2000);

    } catch (err: any) {
      console.error("❌ Erro no cadastro:", err);
      console.error("❌ Resposta do erro:", err.response?.data);
      console.error("❌ Status:", err.response?.status);
      console.error("❌ Headers:", err.response?.headers);

      // Extrair mensagens de erro
      let mensagemErro = "Erro ao criar conta. Tente novamente.";

      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        mensagemErro = err.response.data.errors.join(", ");
      } else if (err.response?.data?.message) {
        mensagemErro = err.response.data.message;
      } else if (err.response?.data) {
        mensagemErro = JSON.stringify(err.response.data);
      } else if (err.response?.status) {
        mensagemErro = `Erro HTTP ${err.response.status}`;
      }

      setError(mensagemErro);
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
        Crie sua conta <span className="text-[#ff007f]">Celebrai</span>!
      </h1>

      {error && (
        <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2 text-sm text-green-200">
          {success}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            required
            disabled={loading}
            className="w-1/2 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
          />
          <input
            type="text"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            placeholder="Sobrenome"
            required
            disabled={loading}
            className="w-1/2 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
          />
        </div>

        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="CPF"
          required
          disabled={loading}
          maxLength={14}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

        <input
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="Número de telefone"
          required
          disabled={loading}
          maxLength={15}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="CEP"
          required
          disabled={loading}
          maxLength={9}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

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
          minLength={6}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

        <input
          type="password"
          name="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleChange}
          placeholder="Confirme a senha"
          required
          disabled={loading}
          minLength={6}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#ff007f] disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff007f] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registrando..." : "Registrar-se"}
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

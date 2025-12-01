"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/authContext";
import { Store, CheckCircle, AlertCircle, Loader2, ArrowLeft, Building2, User } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";

export default function TornarSeFornecedorPage() {
    const router = useRouter();
    const { usuario } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [authError, setAuthError] = useState(false); // Novo estado para controlar erro de autenticação
    const [tipoFornecedor, setTipoFornecedor] = useState<"PF" | "PJ">("PF");
    const [formData, setFormData] = useState({
        raioAtuacao: "",
        atendimentoPresencial: false,
        lograduro: "",
        numero: "",
        cep: "",
        // Pessoa Física
        nomeCompleto: "",
        cpf: "",
        // Pessoa Jurídica
        razaoSocial: "",
        cnpj: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Verificar se o token existe
            const token = localStorage.getItem('celebrai_token');

            if (!token) {
                setError("Você precisa estar autenticado. Faça login novamente.");
                setAuthError(true);
                setLoading(false);
                return;
            }

            // Tentar decodificar o token JWT para ver se está válido
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));

                    if (payload.exp * 1000 < Date.now()) {
                        setError("Seu token expirou. Faça login novamente.");
                        setAuthError(true);
                        setLoading(false);
                        return;
                    }
                } else {
                    // Token com formato inválido
                }
            } catch (e) {
                // Erro ao decodificar token
            }

            // Backend C# espera propriedades com PascalCase (primeira letra maiúscula)
            const requestData = {
                RaioAtuacao: parseInt(formData.raioAtuacao),
                AtendimentoPresencial: formData.atendimentoPresencial,
                Lograduro: formData.lograduro,
                Numero: formData.numero,
                CEP: formData.cep.replace(/\D/g, ""),
                TipoFornecedor: tipoFornecedor,
                ...(tipoFornecedor === "PF" ? {
                    NomeCompleto: formData.nomeCompleto,
                    CPF: formData.cpf.replace(/\D/g, ""),
                } : {
                    RazaoSocial: formData.razaoSocial,
                    CNPJ: formData.cnpj.replace(/\D/g, ""),
                }),
            };

            const response = await api.post('/fornecedor', requestData);

            setSuccess(true);

            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.reload(); // Recarrega para atualizar o contexto
            }, 2000);

        } catch (err: any) {
            let mensagemErro = "Erro ao atualizar conta. Tente novamente.";

            // Erro de autenticação - token expirado ou inválido
            if (err.response?.status === 401) {
                mensagemErro = "Sua sessão expirou ou é inválida. Por favor, faça login novamente para continuar.";
                setAuthError(true);
            }
            else if (err.response?.status === 404) {
                mensagemErro = "Usuário não encontrado. Sua conta pode ter sido desativada.";
                setAuthError(true);
            }
            else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                mensagemErro = err.response.data.errors.join(", ");
            }
            else if (err.response?.data?.message) {
                mensagemErro = err.response.data.message;
            }
            else if (typeof err.response?.data === 'string') {
                mensagemErro = err.response.data;
            }
            else if (err.response?.status === 500) {
                mensagemErro = "Erro no servidor. Por favor, tente novamente mais tarde.";
            }
            else if (err.message) {
                mensagemErro = `Erro: ${err.message}`;
            }

            setError(mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24 pb-10 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Botão Voltar */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Voltar</span>
                </Link>

                {/* Card Principal */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {/* Ícone e Título */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Torne-se um Fornecedor
                        </h1>
                        <p className="text-gray-600">
                            Expanda suas oportunidades e comece a vender na Celebraí!
                        </p>
                    </div>

                    {!showForm ? (
                        <>
                            {/* Benefícios */}
                            <div className="space-y-4 mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Benefícios de ser um fornecedor:
                                </h2>

                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Venda seus produtos</h3>
                                        <p className="text-sm text-gray-600">Cadastre e gerencie seus produtos facilmente</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Alcance mais clientes</h3>
                                        <p className="text-sm text-gray-600">Tenha acesso a uma base crescente de consumidores</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Painel de controle completo</h3>
                                        <p className="text-sm text-gray-600">Gerencie pedidos, estoque e vendas em um só lugar</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Suporte dedicado</h3>
                                        <p className="text-sm text-gray-600">Conte com nossa equipe para ajudar no seu crescimento</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botão de Ação */}
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2"
                            >
                                <Store className="w-5 h-5" />
                                Continuar para Cadastro
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Formulário */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tipo de Fornecedor */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Tipo de Fornecedor
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setTipoFornecedor("PF")}
                                            className={`p-4 border-2 rounded-lg transition ${tipoFornecedor === "PF"
                                                ? "border-purple-600 bg-purple-50"
                                                : "border-gray-300 hover:border-purple-300"
                                                }`}
                                        >
                                            <User className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                            <p className="font-semibold text-gray-900">Pessoa Física</p>
                                            <p className="text-xs text-gray-600 mt-1">CPF</p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setTipoFornecedor("PJ")}
                                            className={`p-4 border-2 rounded-lg transition ${tipoFornecedor === "PJ"
                                                ? "border-purple-600 bg-purple-50"
                                                : "border-gray-300 hover:border-purple-300"
                                                }`}
                                        >
                                            <Building2 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                            <p className="font-semibold text-gray-900">Pessoa Jurídica</p>
                                            <p className="text-xs text-gray-600 mt-1">CNPJ</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Campos PF/PJ */}
                                {tipoFornecedor === "PF" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nome Completo
                                            </label>
                                            <input
                                                type="text"
                                                name="nomeCompleto"
                                                value={formData.nomeCompleto}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                CPF
                                            </label>
                                            <input
                                                type="text"
                                                name="cpf"
                                                value={formData.cpf}
                                                onChange={handleChange}
                                                required
                                                maxLength={14}
                                                placeholder="000.000.000-00"
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Razão Social
                                            </label>
                                            <input
                                                type="text"
                                                name="razaoSocial"
                                                value={formData.razaoSocial}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                CNPJ
                                            </label>
                                            <input
                                                type="text"
                                                name="cnpj"
                                                value={formData.cnpj}
                                                onChange={handleChange}
                                                required
                                                maxLength={18}
                                                placeholder="00.000.000/0000-00"
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Endereço */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Logradouro
                                        </label>
                                        <input
                                            type="text"
                                            name="lograduro"
                                            value={formData.lograduro}
                                            onChange={handleChange}
                                            required
                                            placeholder="Rua, Avenida, etc."
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            name="numero"
                                            value={formData.numero}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleChange}
                                            required
                                            maxLength={9}
                                            placeholder="00000-000"
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Raio de Atuação (km)
                                        </label>
                                        <input
                                            type="number"
                                            name="raioAtuacao"
                                            value={formData.raioAtuacao}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                            placeholder="Ex: 10"
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Atendimento Presencial */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="atendimentoPresencial"
                                        checked={formData.atendimentoPresencial}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Realizo atendimento presencial
                                    </label>
                                </div>

                                {/* Mensagens de Erro/Sucesso */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-red-700 text-sm font-medium">{error}</p>
                                        </div>
                                        {(error.includes("sessão expirou") || error.includes("sessão") || error.includes("Usuário não encontrado") || error.includes("autenticado")) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    localStorage.removeItem('celebrai_token');
                                                    localStorage.removeItem('celebrai_user_name');
                                                    localStorage.removeItem('celebrai_user');
                                                    router.push("/Login");
                                                }}
                                                className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition"
                                            >
                                                Fazer Login Novamente
                                            </button>
                                        )}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-green-700 text-sm font-medium">
                                            Conta atualizada com sucesso! Redirecionando...
                                        </p>
                                    </div>
                                )}

                                {/* Botões */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        disabled={loading || success}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || success}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processando...
                                            </>
                                        ) : success ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Conta Atualizada!
                                            </>
                                        ) : (
                                            <>
                                                <Store className="w-5 h-5" />
                                                Ativar Conta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Informação adicional */}
                            <p className="text-xs text-gray-500 text-center mt-4">
                                Ao se tornar fornecedor, você concorda com os{" "}
                                <span className="underline cursor-pointer hover:text-purple-600">
                                    Termos de Fornecedor
                                </span>{" "}
                                da Celebraí.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

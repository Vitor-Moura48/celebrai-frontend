"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/Context/authContext";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Building, ArrowLeft, Save } from "lucide-react";
import axios from "axios";

export default function EditarPerfilPage() {
    const { usuario, isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/Login");
            return;
        }

        const carregarDados = async () => {
            try {
                setLoadingData(true);

                // Tentar buscar dados do localStorage primeiro
                const telefone = localStorage.getItem('celebrai_user_telefone') || "";
                const endereco = localStorage.getItem('celebrai_user_endereco') || "";
                const cidade = localStorage.getItem('celebrai_user_cidade') || "";
                const estado = localStorage.getItem('celebrai_user_estado') || "";
                const cep = localStorage.getItem('celebrai_user_cep') || "";

                setFormData({
                    nome: usuario?.nome || "",
                    email: usuario?.email || "",
                    telefone,
                    endereco,
                    cidade,
                    estado,
                    cep,
                });
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoadingData(false);
            }
        };

        carregarDados();
    }, [isAuthenticated, router, usuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Salvar no localStorage por enquanto (até ter endpoint de atualização)
            localStorage.setItem('celebrai_user_telefone', formData.telefone);
            localStorage.setItem('celebrai_user_endereco', formData.endereco);
            localStorage.setItem('celebrai_user_cidade', formData.cidade);
            localStorage.setItem('celebrai_user_estado', formData.estado);
            localStorage.setItem('celebrai_user_cep', formData.cep);

            // Se o nome ou email mudaram, atualizar também
            if (formData.nome !== usuario?.nome) {
                localStorage.setItem('celebrai_user_name', formData.nome);
            }
            if (formData.email !== usuario?.email) {
                localStorage.setItem('celebrai_user_email', formData.email);
            }

            setLoading(false);
            setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });

            setTimeout(() => {
                router.push("/perfil");
            }, 1500);
        } catch (error) {
            setLoading(false);
            setMessage({ type: "error", text: "Erro ao salvar. Tente novamente." });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push("/perfil")}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar para o perfil
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
                    <p className="text-gray-600 mt-2">Atualize suas informações pessoais</p>
                </div>

                {/* Mensagem de feedback */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${message.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informações Básicas */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-600" />
                                Informações Básicas
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="(00) 00000-0000"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Endereço */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-purple-600" />
                                Endereço
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                                        Endereço
                                    </label>
                                    <input
                                        type="text"
                                        id="endereco"
                                        name="endereco"
                                        value={formData.endereco}
                                        onChange={handleChange}
                                        placeholder="Rua, número, complemento"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        id="cidade"
                                        name="cidade"
                                        value={formData.cidade}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado
                                    </label>
                                    <input
                                        type="text"
                                        id="estado"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        placeholder="UF"
                                        maxLength={2}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                                        CEP
                                    </label>
                                    <input
                                        type="text"
                                        id="cep"
                                        name="cep"
                                        value={formData.cep}
                                        onChange={handleChange}
                                        placeholder="00000-000"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.push("/perfil")}
                                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Salvar Alterações
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Nota */}
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-800">
                            <strong>Nota:</strong> Campos marcados com * são obrigatórios. Suas informações são mantidas em segurança.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

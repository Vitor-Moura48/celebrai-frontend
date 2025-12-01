"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/Context/authContext";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, Phone, MapPin, Building, Edit, LogOut } from "lucide-react";
import axios from "axios";

interface PerfilUsuario {
    idUsuario?: number;
    nome: string;
    email: string;
    telefone?: string;
    dataCriacao?: string;
    role?: string;
    ativo?: boolean;
    // Campos específicos de fornecedor
    cpfCnpj?: string;
    nomeFantasia?: string;
    razaoSocial?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
}

export default function PerfilPage() {
    const { usuario, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/Login");
            return;
        }

        const fetchPerfil = async () => {
            try {
                setLoading(true);

                // Buscar dados do localStorage
                const telefone = localStorage.getItem('celebrai_user_telefone') || undefined;
                const endereco = localStorage.getItem('celebrai_user_endereco') || undefined;
                const cidade = localStorage.getItem('celebrai_user_cidade') || undefined;
                const estado = localStorage.getItem('celebrai_user_estado') || undefined;
                const cep = localStorage.getItem('celebrai_user_cep') || undefined;

                // Por enquanto, usar apenas os dados do contexto e localStorage
                // já que o endpoint /usuario/perfil ainda não está implementado no backend
                setPerfil({
                    nome: usuario?.nome || "Usuário",
                    email: usuario?.email || "",
                    telefone,
                    endereco,
                    cidade,
                    estado,
                    cep,
                    role: usuario?.tipo === "fornecedor" ? "Fornecedor" : "Cliente",
                });

                // Caso queira tentar buscar do backend no futuro, descomentar:
                /*
                const token = localStorage.getItem("celebrai_token");
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5156";
        
                const response = await axios.get(`${API_URL}/usuario/perfil`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
        
                setPerfil(response.data);
                */
            } catch (err: any) {
                // Fallback para dados do contexto em caso de erro
                setPerfil({
                    nome: usuario?.nome || "Usuário",
                    email: usuario?.email || "",
                    role: usuario?.tipo === "fornecedor" ? "Fornecedor" : "Cliente",
                });
            } finally {
                setLoading(false);
            }
        }; fetchPerfil();
    }, [isAuthenticated, router, usuario]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (error && !perfil) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
                    <div className="text-red-500 mb-4">
                        <User className="w-16 h-16 mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar perfil</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                        Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    const isFornecedor = perfil?.role === "Fornecedor" || usuario?.tipo === "fornecedor";

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-500 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex items-end justify-between -mt-16 mb-6">
                            <div className="flex items-end gap-4">
                                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <User className="w-16 h-16 text-purple-600" />
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{perfil?.nome || "Usuário"}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Shield className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-600">
                                            {isFornecedor ? "Fornecedor" : "Cliente"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => router.push("/perfil/editar")}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sair
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informações Pessoais */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-purple-600" />
                        Informações Pessoais
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-purple-600 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Email</p>
                                <p className="text-gray-900">{perfil?.email || "Não informado"}</p>
                            </div>
                        </div>

                        {perfil?.telefone && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-purple-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Telefone</p>
                                    <p className="text-gray-900">{perfil.telefone}</p>
                                </div>
                            </div>
                        )}

                        {perfil?.dataCriacao && (
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Membro desde</p>
                                    <p className="text-gray-900">
                                        {new Date(perfil.dataCriacao).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </div>
                        )}

                        {perfil?.ativo !== undefined && (
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-purple-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Status da Conta</p>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${perfil.ativo
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {perfil.ativo ? "Ativa" : "Inativa"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Informações de Fornecedor (se aplicável) */}
                {isFornecedor && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Building className="w-6 h-6 text-purple-600" />
                            Informações do Fornecedor
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {perfil?.nomeFantasia && (
                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 text-purple-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Nome Fantasia</p>
                                        <p className="text-gray-900">{perfil.nomeFantasia}</p>
                                    </div>
                                </div>
                            )}

                            {perfil?.razaoSocial && (
                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 text-purple-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Razão Social</p>
                                        <p className="text-gray-900">{perfil.razaoSocial}</p>
                                    </div>
                                </div>
                            )}

                            {perfil?.cpfCnpj && (
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-purple-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">CPF/CNPJ</p>
                                        <p className="text-gray-900">{perfil.cpfCnpj}</p>
                                    </div>
                                </div>
                            )}

                            {(perfil?.endereco || perfil?.cidade || perfil?.estado || perfil?.cep) && (
                                <div className="flex items-start gap-3 md:col-span-2">
                                    <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Endereço</p>
                                        <p className="text-gray-900">
                                            {perfil?.endereco && <span>{perfil.endereco}<br /></span>}
                                            {perfil?.cidade && perfil?.estado && (
                                                <span>{perfil.cidade} - {perfil.estado}</span>
                                            )}
                                            {perfil?.cep && <span><br />CEP: {perfil.cep}</span>}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isFornecedor && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => router.push("/Vendedor")}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
                                >
                                    Gerenciar Meus Produtos
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Ações Rápidas para Clientes */}
                {!isFornecedor && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                onClick={() => router.push("/Carrinho")}
                                className="bg-purple-100 text-purple-700 px-6 py-4 rounded-lg hover:bg-purple-200 transition font-medium text-left"
                            >
                                <span className="block text-lg font-bold mb-1">Meu Carrinho</span>
                                <span className="text-sm">Ver itens selecionados</span>
                            </button>
                            <button
                                onClick={() => router.push("/Busca")}
                                className="bg-purple-100 text-purple-700 px-6 py-4 rounded-lg hover:bg-purple-200 transition font-medium text-left"
                            >
                                <span className="block text-lg font-bold mb-1">Buscar Produtos</span>
                                <span className="text-sm">Encontre o que precisa</span>
                            </button>
                            <button
                                onClick={() => router.push("/tornar-se-fornecedor")}
                                className="bg-green-100 text-green-700 px-6 py-4 rounded-lg hover:bg-green-200 transition font-medium text-left md:col-span-2"
                            >
                                <span className="block text-lg font-bold mb-1">Quer vender no Celebraí?</span>
                                <span className="text-sm">Torne-se um fornecedor</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/authContext";
import {
  Package,
  Upload,
  LayoutDashboard,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  ImageOff,
  ArrowLeft,
} from "lucide-react";
import api from "@/lib/api/axios";
import produtoService from "@/lib/api/services/produtoService";
import pedidoService from "@/lib/api/services/pedidoService";
import kitService from "@/lib/api/services/kitService";

/* ─────────────────────────────── constants ─────────────────────────────── */

const SUBCATEGORIAS = [
  { value: 1, label: "Casamento - Kits", categoria: "Casamento" },
  { value: 2, label: "Recepção - Kits", categoria: "Casamento" },
  { value: 3, label: "Cerimônia - Kits", categoria: "Casamento" },
  { value: 4, label: "Aniversário - Kits", categoria: "Aniversário" },
  { value: 5, label: "Infantil - Kits", categoria: "Aniversário" },
  { value: 6, label: "Adulto - Kits", categoria: "Aniversário" },
  { value: 7, label: "Corporativos - Kits", categoria: "Corporativo" },
  { value: 8, label: "Casamento - Orçamentos", categoria: "Casamento" },
  { value: 9, label: "Aniversário - Orçamentos", categoria: "Aniversário" },
  { value: 10, label: "Corporativos - Orçamentos", categoria: "Corporativo" },
];

type Tab = "produtos" | "adicionar" | "pedidos" | "kits" | "adicionarKit";

/* ───────────────────────── status badge helpers ─────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pendente:   { label: "Pendente",   color: "bg-amber-100 text-amber-700 border-amber-200",   icon: <Clock size={12} /> },
    confirmado: { label: "Confirmado", color: "bg-green-100 text-green-700 border-green-200",   icon: <CheckCircle2 size={12} /> },
    enviado:    { label: "Enviado",    color: "bg-blue-100 text-blue-700 border-blue-200",      icon: <Truck size={12} /> },
    entregue:   { label: "Entregue",   color: "bg-purple-100 text-purple-700 border-purple-200",icon: <CheckCircle2 size={12} /> },
    cancelado:  { label: "Cancelado",  color: "bg-red-100 text-red-700 border-red-200",         icon: <XCircle size={12} /> },
  };
  const s = map[status?.toLowerCase()] ?? { label: status, color: "bg-gray-100 text-gray-600 border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
      {s.icon}{s.label}
    </span>
  );
}

/* ─────────────────────── confirm delete modal ───────────────────────────── */

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Excluindo...</> : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── edit product modal ──────────────────────────────── */

function EditModal({
  produto,
  onClose,
  onSaved,
}: {
  produto: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    nome: produto.nome ?? "",
    descricao: produto.descricao ?? "",
    subCategoria: String(produto.subCategoria ?? produto.idSubcategoria ?? "1"),
    precoUnitario: String(produto.precoUnitario ?? produto.preco ?? ""),
    quantidadeAluguelPorDia: String(produto.quantidadeAluguelPorDia ?? "1"),
  });
  const [novaImagem, setNovaImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNovaImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("Nome", form.nome);
      data.append("Descricao", form.descricao);
      data.append("SubCategoria", form.subCategoria);
      data.append("PrecoUnitario", form.precoUnitario);
      data.append("QuantidadeAluguelPorDia", form.quantidadeAluguelPorDia);
      if (novaImagem) data.append("Imagem", novaImagem);

      await produtoService.atualizar(produto.idProduto ?? produto.id, data);
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.errors?.[0] ?? err?.response?.data?.message ?? "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header do modal */}
        <div
          className="px-6 py-4 flex items-center justify-between sticky top-0 rounded-t-2xl z-10"
          style={{ background: "linear-gradient(120deg, rgba(109,40,217,1) 0%, rgba(219,39,119,1) 100%)" }}
        >
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Pencil size={18} /> Editar Produto
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea
              rows={3}
              value={form.descricao}
              onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Categoria</label>
            <select
              value={form.subCategoria}
              onChange={(e) => setForm((p) => ({ ...p, subCategoria: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              {SUBCATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Preço e Qtd */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preço (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precoUnitario}
                onChange={(e) => setForm((p) => ({ ...p, precoUnitario: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qtd/Dia</label>
              <input
                type="number"
                min="1"
                value={form.quantidadeAluguelPorDia}
                onChange={(e) => setForm((p) => ({ ...p, quantidadeAluguelPorDia: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nova Imagem (opcional)</label>
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="preview" className="w-full h-40 object-contain rounded-xl border border-gray-200 bg-gray-50" />
                <button
                  onClick={() => { setNovaImagem(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition">
                <Upload className="text-gray-400 mb-2" size={28} />
                <span className="text-sm text-gray-500">Clique para trocar a imagem</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }}
              className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              {saving ? <><RefreshCw size={14} className="animate-spin" /> Salvando...</> : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── tab: Meus Produtos ──────────────────────────────── */

function TabMeusProdutos({ onAddNew }: { onAddNew: () => void }) {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduto, setEditingProduto] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const data = await produtoService.listarMeusProdutosReal();
      setProdutos(Array.isArray(data) ? data : []);
    } catch {
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProdutos(); }, []);

  const handleDelete = async () => {
    if (deletingId == null) return;
    setDeleteLoading(true);
    try {
      await produtoService.deletar(deletingId);
      showToast("success", "Produto excluído com sucesso.");
      fetchProdutos();
    } catch {
      showToast("error", "Erro ao excluir produto. Tente novamente.");
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-right duration-300 ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.text}
        </div>
      )}

      {/* Delete Modal */}
      {deletingId != null && (
        <ConfirmModal
          title="Excluir produto?"
          message="Esta ação não pode ser desfeita. O produto será removido permanentemente."
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          loading={deleteLoading}
        />
      )}

      {/* Edit Modal */}
      {editingProduto && (
        <EditModal
          produto={editingProduto}
          onClose={() => setEditingProduto(null)}
          onSaved={() => {
            setEditingProduto(null);
            showToast("success", "Produto atualizado com sucesso.");
            fetchProdutos();
          }}
        />
      )}

      {/* Content */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Meus Produtos</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie seus produtos cadastrados</p>
        </div>
        <button
          onClick={onAddNew}
          style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-md"
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Package className="text-purple-400" size={36} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum produto ainda</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">Você ainda não cadastrou nenhum produto. Comece agora!</p>
          <button
            onClick={onAddNew}
            style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
          >
            <Plus size={16} /> Adicionar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto) => {
            const id = produto.idProduto ?? produto.id;
            const nome = produto.nome ?? "Produto sem nome";
            const preco = produto.precoUnitario ?? produto.preco ?? 0;
            const imagem = produto.imagemUrl ?? produto.imagem ?? null;
            const subCat = SUBCATEGORIAS.find((s) => s.value === (produto.subCategoria ?? produto.idSubcategoria))?.label ?? "—";

            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Imagem */}
                <div className="w-full h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {imagem ? (
                    <img
                      src={imagem}
                      alt={nome}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageOff className="text-gray-300" size={40} />
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1">{nome}</p>
                  <p className="text-xs text-gray-500 mb-2">{subCat}</p>
                  <p
                    className="text-base font-bold"
                    style={{ background: "linear-gradient(90deg,#6d28d9,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    R$ {Number(preco).toFixed(2)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingProduto(produto)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-50 transition"
                    >
                      <Pencil size={13} /> Editar
                    </button>
                    <button
                      onClick={() => setDeletingId(id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition"
                    >
                      <Trash2 size={13} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ────────────────────── tab: Adicionar Produto ──────────────────────────── */

function TabAdicionarProduto({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    subCategoria: "1",
    precoUnitario: "",
    quantidadeAluguelPorDia: "1",
  });
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (!imagem) {
        setMessage({ type: "error", text: "Por favor, selecione uma imagem para o produto." });
        setIsSubmitting(false);
        return;
      }
      const data = new FormData();
      data.append("Nome", formData.nome);
      data.append("Descricao", formData.descricao);
      data.append("SubCategoria", formData.subCategoria);
      data.append("PrecoUnitario", formData.precoUnitario);
      data.append("QuantidadeAluguelPorDia", formData.quantidadeAluguelPorDia);
      data.append("Imagem", imagem);

      await api.post("/produto", data, { headers: { "Content-Type": "multipart/form-data" } });

      setMessage({ type: "success", text: "Produto cadastrado com sucesso!" });
      setFormData({ nome: "", descricao: "", subCategoria: "1", precoUnitario: "", quantidadeAluguelPorDia: "1" });
      setImagem(null);
      setPreviewUrl(null);

      setTimeout(() => onSuccess(), 1800);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Erro ao cadastrar produto. Tente novamente.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Adicionar Novo Produto</h2>
        <p className="text-sm text-gray-500 mt-0.5">Preencha as informações do seu novo produto</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        {/* Nome */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Produto *</label>
          <input
            type="text" name="nome" value={formData.nome} onChange={handleInputChange} required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Ex: Kit Festa Infantil Tema Princesa"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descrição *</label>
          <textarea
            name="descricao" value={formData.descricao} onChange={handleInputChange} required rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Descreva seu produto em detalhes..."
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Categoria *</label>
          <select
            name="subCategoria" value={formData.subCategoria} onChange={handleInputChange} required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          >
            {SUBCATEGORIAS.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Preço e Quantidade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preço Unitário (R$) *</label>
            <input
              type="number" name="precoUnitario" value={formData.precoUnitario} onChange={handleInputChange}
              required min="0" step="0.01"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qtd. Aluguel/Dia</label>
            <input
              type="number" name="quantidadeAluguelPorDia" value={formData.quantidadeAluguelPorDia} onChange={handleInputChange} min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Upload de Imagem */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Imagem do Produto *</label>
          {previewUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={previewUrl} alt="Preview" className="w-full h-52 object-contain bg-gray-50" />
              <button
                type="button"
                onClick={() => { setImagem(null); setPreviewUrl(null); }}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 transition">
              <Upload className="text-gray-400 mb-3" size={36} />
              <p className="text-sm text-gray-500 font-medium">Clique para selecionar uma imagem</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG até 10MB</p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={isSubmitting}
            style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-md"
          >
            {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Cadastrando...</> : <><Plus size={16} /> Cadastrar Produto</>}
          </button>
        </div>
      </form>
    </>
  );
}


/* ────────────────────── order details modal ───────────────────────────── */

function OrderDetailsModal({ pedidoId, onClose, onStatusUpdated }: { pedidoId: any, onClose: () => void, onStatusUpdated: () => void }) {
  const [loading, setLoading] = useState(true);
  const [kits, setKits] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [k, p] = await Promise.all([
          pedidoService.buscarKitsPorPedido(pedidoId),
          pedidoService.buscarProdutosPorPedido(pedidoId)
        ]);
        setKits(Array.isArray(k) ? k : []);
        setProdutos(Array.isArray(p) ? p : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pedidoId]);

  const updateStatus = async (novoStatus: string) => {
    setUpdating(true);
    try {
      await pedidoService.atualizar(pedidoId, { status: novoStatus });
      onStatusUpdated();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async () => {
    setUpdating(true);
    try {
      await pedidoService.deletar(pedidoId);
      onStatusUpdated();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 rounded-t-2xl z-10" style={{ background: "linear-gradient(120deg, #6d28d9 0%, #db2777 100%)" }}>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">Detalhes do Pedido #{String(pedidoId).slice(-6).toUpperCase()}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition"><X size={22} /></button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10"><RefreshCw className="animate-spin text-purple-500" size={32} /></div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 border-b pb-2">Kits</h4>
                {kits.length === 0 ? <p className="text-sm text-gray-500">Nenhum kit neste pedido.</p> : (
                  <div className="space-y-2">
                    {kits.map((k: any, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{k.nomeKit || "Kit ID: " + k.kitId}</p>
                          <p className="text-xs text-gray-500">Qtd: {k.quantidade}</p>
                        </div>
                        <p className="font-semibold text-sm">R$ {Number(k.precoUnitario || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 border-b pb-2">Produtos</h4>
                {produtos.length === 0 ? <p className="text-sm text-gray-500">Nenhum produto avulso neste pedido.</p> : (
                  <div className="space-y-2">
                    {produtos.map((p: any, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{p.nomeProduto || "Produto ID: " + p.produtoId}</p>
                          <p className="text-xs text-gray-500">Qtd: {p.quantidade}</p>
                        </div>
                        <p className="font-semibold text-sm">R$ {Number(p.precoUnitario || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex flex-wrap gap-3">
                <button disabled={updating} onClick={() => updateStatus("confirmado")} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200">Aprovar Pedido</button>
                <button disabled={updating} onClick={() => updateStatus("enviado")} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200">Marcar como Enviado</button>
                <button disabled={updating} onClick={cancelOrder} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200">Cancelar / Excluir</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── tab: Pedidos Recebidos ──────────────────────────── */

function TabPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<any | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pedidoService.listarFornecedorPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("Não foi possível carregar os pedidos. Tente novamente.");
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPedidos(); }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(dateStr));
    } catch { return dateStr; }
  };

  return (
    <>
      {selectedPedido && (
        <OrderDetailsModal 
          pedidoId={selectedPedido.idPedido ?? selectedPedido.id} 
          onClose={() => setSelectedPedido(null)}
          onStatusUpdated={fetchPedidos}
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pedidos Recebidos</h2>
          <p className="text-sm text-gray-500 mt-0.5">Acompanhe todos os pedidos dos seus clientes</p>
        </div>
        <button onClick={fetchPedidos} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
          <RefreshCw size={15} /> Atualizar
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4"><XCircle className="text-red-400" size={30} /></div>
          <p className="text-gray-600 font-medium mb-1">Erro ao carregar pedidos</p>
          <p className="text-sm text-gray-400 mb-5">{error}</p>
          <button onClick={fetchPedidos} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"><RefreshCw size={14} /> Tentar novamente</button>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4"><ShoppingBag className="text-purple-400" size={36} /></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum pedido ainda</h3>
          <p className="text-sm text-gray-500 max-w-xs">Quando clientes fizerem pedidos dos seus produtos, eles aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido, idx) => {
            const id = pedido.idPedido ?? pedido.id ?? idx;
            const status = pedido.status ?? "pendente";
            const total = pedido.total ?? pedido.valorTotal ?? 0;
            const cliente = pedido.nomeCliente ?? pedido.cliente?.nome ?? "Cliente";
            const data = pedido.criadoEm ?? pedido.dataCriacao ?? "";
            const itens = pedido.quantidadeItens ?? pedido.itens?.length ?? "—";

            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 font-mono">#{String(id).slice(-6).toUpperCase()}</span>
                    <StatusBadge status={status} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm truncate">{cliente}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(data)} · {itens} {itens === 1 ? "item" : "itens"}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-lg font-bold" style={{ background: "linear-gradient(90deg,#6d28d9,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>R$ {Number(total).toFixed(2)}</p>
                  </div>
                  <button onClick={() => setSelectedPedido(pedido)} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-100 transition whitespace-nowrap">Ver Detalhes</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}



/* ────────────────────── edit kit modal ──────────────────────────────── */

function EditKitModal({
  kit,
  todosOsProdutos,
  onClose,
  onSaved,
}: {
  kit: any;
  todosOsProdutos: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  // Backend returns kit.produtos as full ResponseProdutoJson objects, each with idProduto
  const produtosNoKit: any[] = kit.produtos || [];
  const initialIds = produtosNoKit.map((p: any) => Number(p.idProduto ?? p.id));

  const [form, setForm] = useState({
    nome: kit.nome ?? "",
    descricao: kit.descricao ?? "",
    kitPreco: String(kit.kitPreco ?? kit.preco ?? ""),
    quantidadeAluguelPorDia: String(kit.quantidadeAluguelPorDia ?? "1"),
    vendaIndividual: kit.vendaIndividual ?? false,
    produtosIds: initialIds,
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProdutoToggle = (id: number) => {
    setForm(p => ({
      ...p,
      produtosIds: p.produtosIds.includes(id) 
        ? p.produtosIds.filter((pid: number) => pid !== id)
        : [...p.produtosIds, id]
    }));
  };

  const handleSave = async () => {
    if (form.produtosIds.length < 2) {
      setError("O kit deve ter pelo menos 2 produtos.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        kitPreco: parseFloat(form.kitPreco),
        quantidadeAluguelPorDia: parseInt(form.quantidadeAluguelPorDia, 10),
        vendaIndividual: form.vendaIndividual,
        produtosIds: form.produtosIds
      };
      await kitService.atualizar(kit.idKit ?? kit.id, payload);
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.errors?.[0] ?? err?.response?.data?.message ?? "Erro ao salvar kit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 rounded-t-2xl z-10" style={{ background: "linear-gradient(120deg, rgba(109,40,217,1) 0%, rgba(219,39,119,1) 100%)" }}>
          <h3 className="text-white font-bold text-lg flex items-center gap-2"><Pencil size={18} /> Editar Kit</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition"><X size={22} /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Kit</label>
            <input type="text" value={form.nome} onChange={(e) => setForm(p => ({ ...p, nome: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea rows={3} value={form.descricao} onChange={(e) => setForm(p => ({ ...p, descricao: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preço (R$)</label>
              <input type="number" min="0" step="0.01" value={form.kitPreco} onChange={(e) => setForm(p => ({ ...p, kitPreco: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qtd/Dia</label>
              <input type="number" min="1" value={form.quantidadeAluguelPorDia} onChange={(e) => setForm(p => ({ ...p, quantidadeAluguelPorDia: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="editVendaIndividual" checked={form.vendaIndividual} onChange={(e) => setForm(p => ({ ...p, vendaIndividual: e.target.checked }))} className="w-4 h-4 text-purple-600 rounded border-gray-300" />
            <label htmlFor="editVendaIndividual" className="text-sm font-semibold text-gray-700">Permitir venda individual</label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Produtos do Kit</label>
            <div className="border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto bg-gray-50">
              {todosOsProdutos.length === 0 ? <p className="text-xs text-gray-500">Nenhum produto cadastrado.</p> : (
                <div className="space-y-2">
                  {todosOsProdutos.map(prod => {
                    const prodId = Number(prod.idProduto ?? prod.id);
                    return (
                      <label key={prodId} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
                        <input type="checkbox" checked={form.produtosIds.includes(prodId)} onChange={() => handleProdutoToggle(prodId)} className="w-4 h-4 text-purple-600 rounded border-gray-300" />
                        <span className="text-sm font-medium text-gray-700">{prod.nome}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2">{saving ? <><RefreshCw size={14} className="animate-spin" /> Salvando...</> : "Salvar Alterações"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}



/* ────────────────────── tab: Meus Kits ──────────────────────────────── */

function TabMeusKits({ onAddNew }: { onAddNew: () => void }) {
  const [kits, setKits] = useState<any[]>([]);
  const [meusProdutos, setMeusProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKit, setEditingKit] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kitsData, prodsData] = await Promise.all([
        kitService.listarMeusKitsReal(),
        produtoService.listarMeusProdutosReal()
      ]);
      setKits(Array.isArray(kitsData) ? kitsData : []);
      setMeusProdutos(Array.isArray(prodsData) ? prodsData : []);
    } catch {
      setKits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (deletingId == null) return;
    setDeleteLoading(true);
    try {
      await kitService.deletar(deletingId);
      showToast("success", "Kit excluído com sucesso.");
      fetchData();
    } catch {
      showToast("error", "Erro ao excluir kit. Tente novamente.");
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      {toast && (
        <div className={`fixed top-24 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-right duration-300 ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.text}
        </div>
      )}

      {deletingId != null && (
        <ConfirmModal title="Excluir kit?" message="Esta ação não pode ser desfeita. O kit será removido permanentemente." onConfirm={handleDelete} onCancel={() => setDeletingId(null)} loading={deleteLoading} />
      )}

      {editingKit && (
        <EditKitModal
          kit={editingKit}
          todosOsProdutos={meusProdutos}
          onClose={() => setEditingKit(null)}
          onSaved={() => {
            setEditingKit(null);
            showToast("success", "Kit atualizado com sucesso.");
            fetchData();
          }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Meus Kits</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie seus kits cadastrados</p>
        </div>
        <button onClick={onAddNew} style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-md">
          <Plus size={16} /> Novo Kit
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : kits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4"><Package className="text-purple-400" size={36} /></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum kit ainda</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">Você ainda não cadastrou nenhum kit.</p>
          <button onClick={onAddNew} style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"><Plus size={16} /> Adicionar Primeiro Kit</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kits.map((kit) => {
            const id = kit.idKit ?? kit.id;
            const nome = kit.nome ?? "Kit sem nome";
            const preco = kit.kitPreco ?? kit.precoUnitario ?? kit.preco ?? 0;
            
            // Backend returns kit.produtos as full ResponseProdutoJson objects
            const produtosNoKit: any[] = kit.produtos || [];
            const imagensParaExibir: string[] = produtosNoKit
              .map((p: any) => p.imagemUrl ?? p.imagem)
              .filter(Boolean)
              .slice(0, 4);
            const qtdItens = produtosNoKit.length;

            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                
                {/* Mosaico de imagens do Kit */}
                <div className="w-full h-44 bg-gray-50 flex items-center justify-center overflow-hidden p-3">
                  {imagensParaExibir.length === 0 ? (
                    <ImageOff className="text-gray-300" size={40} />
                  ) : imagensParaExibir.length === 1 ? (
                    <img src={imagensParaExibir[0]} alt={nome} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className={`w-full h-full grid gap-2 ${imagensParaExibir.length === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'}`}>
                      {imagensParaExibir.map((img, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                          <img src={img} alt="Kit item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-50">
                  <p className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1">{nome}</p>
                  <p className="text-xs text-gray-400 mb-2">{qtdItens} {qtdItens === 1 ? "item" : "itens"} no kit</p>
                  <p className="text-base font-bold" style={{ background: "linear-gradient(90deg,#6d28d9,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>R$ {Number(preco).toFixed(2)}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setEditingKit(kit)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-50 transition"><Pencil size={13} /> Editar</button>
                    <button onClick={() => setDeletingId(id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition"><Trash2 size={13} /> Excluir</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}


/* ────────────────────── tab: Adicionar Kit ──────────────────────────── */

function TabAdicionarKit({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    nome: "", descricao: "", kitPreco: "", quantidadeAluguelPorDia: "1", vendaIndividual: false, produtosIds: [] as number[]
  });
  const [meusProdutos, setMeusProdutos] = useState<any[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const prods = await produtoService.listarMeusProdutosReal();
        setMeusProdutos(Array.isArray(prods) ? prods : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProdutos(false);
      }
    };
    carregarProdutos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProdutoToggle = (id: number) => {
    setFormData(p => ({
      ...p,
      produtosIds: p.produtosIds.includes(id) 
        ? p.produtosIds.filter(pid => pid !== id)
        : [...p.produtosIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.produtosIds.length < 2) {
      setMessage({ type: "error", text: "O kit deve ter pelo menos 2 produtos." });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        kitPreco: parseFloat(formData.kitPreco),
        quantidadeAluguelPorDia: parseInt(formData.quantidadeAluguelPorDia, 10),
        vendaIndividual: formData.vendaIndividual,
        produtosIds: formData.produtosIds
      };

      await kitService.criar(payload);
      setMessage({ type: "success", text: "Kit cadastrado!" });
      setTimeout(() => onSuccess(), 1800);
    } catch (error: any) {
      setMessage({ type: "error", text: error?.response?.data?.errors?.[0] ?? error?.response?.data?.message ?? "Erro ao cadastrar kit." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900">Adicionar Novo Kit</h2></div>
      {message && <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{message.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Kit *</label><input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" /></div>
        <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descrição *</label><textarea name="descricao" value={formData.descricao} onChange={handleInputChange} required rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preço (R$) *</label><input type="number" name="kitPreco" value={formData.kitPreco} onChange={handleInputChange} required step="0.01" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" /></div>
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qtd. Aluguel/Dia *</label><input type="number" name="quantidadeAluguelPorDia" value={formData.quantidadeAluguelPorDia} onChange={handleInputChange} required min="1" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" /></div>
        </div>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="vendaIndividual" name="vendaIndividual" checked={formData.vendaIndividual} onChange={handleInputChange} className="w-4 h-4 text-purple-600 rounded border-gray-300" />
          <label htmlFor="vendaIndividual" className="text-sm font-semibold text-gray-700">Permitir venda individual</label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Produtos do Kit</label>
          <div className="border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto bg-gray-50">
            {loadingProdutos ? <div className="flex justify-center"><RefreshCw className="animate-spin text-purple-500" size={20} /></div> : meusProdutos.length === 0 ? <p className="text-sm text-gray-500">Você não tem produtos cadastrados. Cadastre um produto primeiro.</p> : (
              <div className="space-y-3">
                {meusProdutos.map(prod => (
                  <label key={prod.idProduto ?? prod.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition">
                    <input type="checkbox" checked={formData.produtosIds.includes(prod.idProduto ?? prod.id)} onChange={() => handleProdutoToggle(prod.idProduto ?? prod.id)} className="w-4 h-4 text-purple-600 rounded border-gray-300" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-800">{prod.nome}</span>
                      <span className="block text-xs text-gray-500">R$ {Number(prod.precoUnitario ?? prod.preco ?? 0).toFixed(2)}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ background: "linear-gradient(120deg, #6d28d9, #db2777)" }} className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition flex justify-center items-center gap-2">{isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Cadastrando...</> : <><Plus size={16} /> Cadastrar Kit</>}</button>
      </form>
    </>
  );
}


/* ─────────────────────────── main dashboard ────────────────────────────── */

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "kits",       label: "Meus Kits",        icon: <Package size={18} /> },
  { id: "adicionarKit", label: "Adicionar Kit", icon: <Plus size={18} /> },
  { id: "produtos",   label: "Meus Produtos",    icon: <Package size={18} /> },
  { id: "adicionar", label: "Adicionar Produto", icon: <Plus size={18} /> },
  { id: "pedidos",   label: "Pedidos Recebidos", icon: <ShoppingBag size={18} /> },
];

export default function PainelFornecedorPage() {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("produtos");

  useEffect(() => {
    if (isLoading) return;
    if (!usuario) { router.push("/Login"); return; }
    if (usuario.tipo !== "fornecedor") { router.push("/"); }
  }, [usuario, router, isLoading]);

  if (isLoading) return null;
  if (!usuario) return null;

  return (
    <main className="min-h-screen pt-20 pb-12" style={{ background: "var(--bg-100)" }}>
      {/* Page header */}
      <div
        className="w-full py-8 px-4"
        style={{ background: "linear-gradient(120deg, rgba(109,40,217,0.95) 0%, rgba(162,28,175,0.92) 50%, rgba(219,39,119,0.88) 100%)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Painel do Fornecedor</h1>
            <p className="text-white/70 text-sm mt-0.5">Bem-vindo, {usuario.nome}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar / tab nav */}
          <aside className="lg:w-56 shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    style={
                      isActive
                        ? { background: "linear-gradient(120deg, #6d28d9, #db2777)" }
                        : {}
                    }
                  >
                    <span className={isActive ? "text-white" : "text-gray-400"}>{tab.icon}</span>
                    {tab.label}
                    {isActive && <ChevronRight size={14} className="ml-auto text-white/60" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
            {activeTab === "produtos" && (
              <TabMeusProdutos onAddNew={() => setActiveTab("adicionar")} />
            )}
            {activeTab === "adicionar" && (
              <TabAdicionarProduto onSuccess={() => setActiveTab("produtos")} />
            )}
            {activeTab === "pedidos" && <TabPedidos />}
            {activeTab === "kits" && <TabMeusKits onAddNew={() => setActiveTab("adicionarKit")} />}
            {activeTab === "adicionarKit" && <TabAdicionarKit onSuccess={() => setActiveTab("kits")} />}
          </section>
        </div>
      </div>
    </main>
  );
}

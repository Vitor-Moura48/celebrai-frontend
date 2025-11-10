export interface Categoria {
  nome: string;
  icone: string;
}

export const API_CATEGORY_ICONS: Record<string, string> = {
  "electronics": "📱",
  "jewelery": "💎",
  "men's clothing": "👔",
  "women's clothing": "👗",
};

export const CATEGORIAS_FESTAS: Categoria[] = [
  // Mobiliário
  { nome: "mesas", icone: "🪑" },
  { nome: "cadeiras", icone: "💺" },
  { nome: "tendas", icone: "⛺" },
  { nome: "toalhas", icone: "🧺" },
  // Decoração
  { nome: "decoração", icone: "🎈" },
  { nome: "balões", icone: "🎈" },
  { nome: "flores", icone: "💐" },
  { nome: "centros de mesa", icone: "🌺" },
  { nome: "iluminação", icone: "💡" },
  // Descartáveis
  { nome: "descartáveis", icone: "🥤" },
  { nome: "pratos", icone: "🍽️" },
  { nome: "copos", icone: "🥛" },
  { nome: "talheres", icone: "🍴" },
  { nome: "guardanapos", icone: "📄" },
  // Alimentação
  { nome: "doces", icone: "🍬" },
  { nome: "bolo", icone: "🎂" },
  { nome: "salgados", icone: "🥟" },
  { nome: "bebidas", icone: "🥤" },
  { nome: "churrasqueira", icone: "🔥" },
  // Entretenimento
  { nome: "brinquedos", icone: "🎠" },
  { nome: "jogos", icone: "🎮" },
  { nome: "inflável", icone: "🎪" },
  { nome: "piscina", icone: "🏊" },
  { nome: "som", icone: "🔊" },
  { nome: "DJ", icone: "🎧" },
  // Animação
  { nome: "personagens", icone: "🦸" },
  { nome: "mágico", icone: "🎩" },
  { nome: "palhaço", icone: "🤡" },
  { nome: "fantasias", icone: "🎭" },
  // Tipos de Festas
  { nome: "infantil", icone: "🧸" },
  { nome: "aniversário", icone: "🎂" },
  { nome: "casamento", icone: "💒" },
  { nome: "formatura", icone: "🎓" },
  // Serviços
  { nome: "fotografia", icone: "📸" },
  { nome: "vídeo", icone: "🎥" },
  { nome: "convites", icone: "💌" },
  { nome: "lembrancinhas", icone: "🎁" },
];
export interface BookNote {
  id?: string;
  date: string;
  time: string;
  chapter: string;
  text: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  category: string;
  vibes: string[];
  ownership: "tenho" | "pretendo";
  status: "lido" | "lendo" | "nao-lido";
  progress?: number;
  totalPages?: number;
  currentPage?: number;
  dateFinished?: string;
  notes?: BookNote[];
  review?: string;
  quotes?: string[];
  subRatings?: { label: string; value: number }[];
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    cover: "https://covers.openlibrary.org/b/id/8691906-L.jpg",
    rating: 5,
    category: "Fantasia",
    vibes: ["Favorito da Vida", "Leitura Fluida"],
    ownership: "tenho",
    status: "lido",
    totalPages: 656,
    currentPage: 656,
    dateFinished: "2025-02-14",
    notes: [
      { date: "10/02", time: "21:30", chapter: "Cap. 8", text: "A descrição da música é absurda. Senti arrepios." },
      { date: "12/02", time: "14:15", chapter: "Cap. 15", text: "Kvothe na universidade me lembra tanto Harry Potter, mas mais maduro." },
      { date: "14/02", time: "22:00", chapter: "Cap. 92", text: "Final perfeito. Preciso do segundo livro AGORA." },
    ],
    review: "Uma obra-prima da fantasia moderna. Rothfuss tece palavras como poucos autores conseguem.",
    quotes: [
      "Palavras são coisas pálidas. Você não pode saber a dor de uma palavra até que ela tenha sido dita.",
      "É a história de um homem. Você terá que aguardar para ouvir o resto.",
    ],
    subRatings: [
      { label: "Narrativa", value: 5 },
      { label: "Personagens", value: 5 },
      { label: "Worldbuilding", value: 4 },
    ],
  },
  {
    id: "2",
    title: "Rebecca",
    author: "Daphne du Maurier",
    cover: "https://covers.openlibrary.org/b/id/12818156-L.jpg",
    rating: 4,
    category: "Suspense",
    vibes: ["Para Chorar", "Atmosférico"],
    ownership: "tenho",
    status: "lendo",
    progress: 62,
    totalPages: 380,
    currentPage: 236,
    notes: [
      { date: "25/03", time: "19:30", chapter: "Cap. 12", text: "Não acredito que ela era tão manipuladora! Me tocou muito essa parte..." },
      { date: "26/03", time: "20:45", chapter: "Cap. 15", text: "A tensão está insuportável. Manderley parece viva." },
    ],
    subRatings: [
      { label: "Suspense", value: 5 },
      { label: "Atmosfera", value: 5 },
      { label: "Romance", value: 3 },
    ],
  },
  {
    id: "3",
    title: "Circe",
    author: "Madeline Miller",
    cover: "https://covers.openlibrary.org/b/id/8479576-L.jpg",
    rating: 4,
    category: "Mitologia",
    vibes: ["Empoderador", "Leitura Fluida"],
    ownership: "tenho",
    status: "lendo",
    progress: 35,
    totalPages: 400,
    currentPage: 140,
    notes: [
      { date: "28/03", time: "10:00", chapter: "Cap. 5", text: "A solidão de Circe é palpável. Escrita linda." },
    ],
    subRatings: [
      { label: "Narrativa", value: 5 },
      { label: "Personagens", value: 4 },
    ],
  },
  {
    id: "4",
    title: "O Iluminado",
    author: "Stephen King",
    cover: "https://covers.openlibrary.org/b/id/8560297-L.jpg",
    rating: 5,
    category: "Terror",
    vibes: ["Tenso", "Clássico"],
    ownership: "tenho",
    status: "lido",
    totalPages: 464,
    currentPage: 464,
    dateFinished: "2025-01-20",
    review: "King no seu melhor. O hotel Overlook é um personagem por si só.",
    quotes: ["Aqui está Johnny!"],
    subRatings: [
      { label: "Terror", value: 5 },
      { label: "Personagens", value: 4 },
      { label: "Atmosfera", value: 5 },
    ],
  },
  {
    id: "5",
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    cover: "https://covers.openlibrary.org/b/id/12645114-L.jpg",
    rating: 5,
    category: "Romance",
    vibes: ["Favorito da Vida", "Conforto"],
    ownership: "tenho",
    status: "lido",
    totalPages: 279,
    currentPage: 279,
    dateFinished: "2025-03-01",
    subRatings: [
      { label: "Romance", value: 5 },
      { label: "Humor", value: 4 },
    ],
  },
  {
    id: "6",
    title: "Duna",
    author: "Frank Herbert",
    cover: "https://covers.openlibrary.org/b/id/12467702-L.jpg",
    rating: 0,
    category: "Ficção Científica",
    vibes: [],
    ownership: "pretendo",
    status: "nao-lido",
    totalPages: 688,
  },
  {
    id: "7",
    title: "A Garota no Trem",
    author: "Paula Hawkins",
    cover: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
    rating: 0,
    category: "Suspense",
    vibes: [],
    ownership: "pretendo",
    status: "nao-lido",
    totalPages: 336,
  },
  {
    id: "8",
    title: "It: A Coisa",
    author: "Stephen King",
    cover: "https://covers.openlibrary.org/b/id/8560551-L.jpg",
    rating: 4,
    category: "Terror",
    vibes: ["Tenso", "Para Chorar"],
    ownership: "tenho",
    status: "lido",
    totalPages: 1104,
    currentPage: 1104,
    dateFinished: "2024-11-10",
    subRatings: [
      { label: "Terror", value: 4 },
      { label: "Personagens", value: 5 },
    ],
  },
];

export const readingGoal = {
  year: 2025,
  target: 15,
  current: 4,
};

export const monthlyStats = [
  { month: "Jan", count: 1 },
  { month: "Fev", count: 1 },
  { month: "Mar", count: 1 },
  { month: "Abr", count: 0 },
  { month: "Mai", count: 0 },
  { month: "Jun", count: 0 },
  { month: "Jul", count: 0 },
  { month: "Ago", count: 0 },
  { month: "Set", count: 0 },
  { month: "Out", count: 0 },
  { month: "Nov", count: 1 },
  { month: "Dez", count: 0 },
];

export const readingQueue: string[] = ["6", "7"];

export const categories = [
  "Todos", "Fantasia", "Suspense", "Terror", "Romance", "Mitologia", "Ficção Científica",
  "Ficção", "Biografia", "História", "Autoajuda", "Poesia", "Outros",
];

// Categorias disponíveis para classificar um livro (sem "Todos")
export const categoryOptions = categories.filter((c) => c !== "Todos");

export const vibeOptions = [
  "Favorito da Vida", "Para Chorar", "Leitura Fluida", "Tenso", "Atmosférico",
  "Empoderador", "Conforto", "Clássico", "Surpreendente",
];

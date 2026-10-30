import { categories as defaultCategories } from "@/data/mockBooks";

interface CategoryFilterProps {
  active: string;
  onChange: (cat: string) => void;
  items?: string[];
}

const CategoryFilter = ({ active, onChange, items }: CategoryFilterProps) => {
  const list = items && items.length > 1 ? items : defaultCategories;
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none scroll-smooth">
      {list.map((cat) => {
        const isSelected = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground"
            }`}
          >
            {cat === "Todos" ? "📚 Todos" : cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

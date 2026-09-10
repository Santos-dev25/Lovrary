import { categories as defaultCategories } from "@/data/mockBooks";

interface CategoryFilterProps {
  active: string;
  onChange: (cat: string) => void;
  items?: string[];
}

const CategoryFilter = ({ active, onChange, items }: CategoryFilterProps) => {
  const list = items && items.length > 1 ? items : defaultCategories;
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {list.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            active === cat
              ? "gradient-marsala text-primary-foreground shadow-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          {cat === "Todos" ? "📚 Todos" : cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

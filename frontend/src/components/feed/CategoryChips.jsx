import { categories } from "../../constants/categories.js";
import { cn } from "../../utils/cn.js";

function CategoryChips({ activeCategory, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap",
          activeCategory ? "bg-white/70 text-slate-600" : "bg-slate-950 text-white"
        )}
      >
        For you
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap",
            activeCategory === category
              ? "bg-rose-500 text-white"
              : "bg-white/70 text-slate-600"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryChips;

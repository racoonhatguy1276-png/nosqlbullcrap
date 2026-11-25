import { Plus, Pencil, CheckCircle2 } from 'lucide-react';
import type { FoodItem } from '@/types';

interface Props {
  food: FoodItem;
  onLog: (food: FoodItem) => void;
  onEdit: (food: FoodItem) => void;
  logging?: boolean;
}

const CATEGORY_COLORS: Record<FoodItem['category'], string> = {
  Protein: 'bg-rose-50 text-rose-600',
  Carbs: 'bg-amber-50 text-amber-600',
  Veg: 'bg-emerald-50 text-emerald-600',
  Fruit: 'bg-orange-50 text-orange-600',
  Dairy: 'bg-blue-50 text-blue-600',
  Nuts: 'bg-yellow-50 text-yellow-700',
};

export default function FoodCard({ food, onLog, onEdit, logging }: Props) {
  const customized = !food.isDefaultSeed;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{food.name}</h3>
          <p className="text-xs text-slate-400">{food.servingSize}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[food.category]}`}>
          {food.category}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1 my-3 text-center">
        <Macro label="cal" value={food.calories} />
        <Macro label="P" value={food.protein} />
        <Macro label="C" value={food.carbs} />
        <Macro label="F" value={food.fat} />
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {food.micronutrients.vitaminC > 0 && <MiniTag label={`VitC ${food.micronutrients.vitaminC}`} />}
        {food.micronutrients.iron > 0 && <MiniTag label={`Fe ${food.micronutrients.iron}`} />}
        {food.micronutrients.calcium > 0 && <MiniTag label={`Ca ${food.micronutrients.calcium}`} />}
        {food.micronutrients.potassium > 0 && <MiniTag label={`K ${food.micronutrients.potassium}`} />}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        {customized ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Customized
          </span>
        ) : (
          <span className="text-[10px] text-slate-300 font-medium">Pre-made</span>
        )}
        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(food)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-300 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button
            onClick={() => onLog(food)}
            disabled={logging}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            <Plus className="w-3 h-3" /> Log
          </button>
        </div>
      </div>
    </div>
  );
}

function Macro({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-sm font-bold text-slate-700">{Math.round(value * 10) / 10}</div>
      <div className="text-[10px] text-slate-400 uppercase">{label}</div>
    </div>
  );
}

function MiniTag({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
      {label}
    </span>
  );
}

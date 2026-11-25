import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { FoodItem, Micronutrients } from '@/types';

interface Props {
  open: boolean;
  food: FoodItem | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    category: FoodItem['category'];
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    micronutrients: Micronutrients;
  }) => Promise<void>;
}

const CATEGORIES: FoodItem['category'][] = ['Protein', 'Carbs', 'Veg', 'Fruit', 'Dairy', 'Nuts'];

export default function EditFoodModal({ open, food, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodItem['category']>('Protein');
  const [servingSize, setServingSize] = useState('');
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [micros, setMicros] = useState<Micronutrients>({
    vitaminC: 0,
    vitaminD: 0,
    iron: 0,
    calcium: 0,
    potassium: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (food && open) {
      setName(food.name);
      setCategory(food.category);
      setServingSize(food.servingSize);
      setCalories(food.calories);
      setProtein(food.protein);
      setCarbs(food.carbs);
      setFat(food.fat);
      setMicros(food.micronutrients);
    }
  }, [food, open]);

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ name, category, servingSize, calories, protein, carbs, fat, micronutrients: micros });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Nutrition</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodItem['category'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Serving Size</label>
            <input
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <NumField label="Cal" value={calories} onChange={setCalories} />
            <NumField label="Protein" value={protein} onChange={setProtein} />
            <NumField label="Carbs" value={carbs} onChange={setCarbs} />
            <NumField label="Fat" value={fat} onChange={setFat} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Micronutrients (per serving)</p>
            <div className="grid grid-cols-3 gap-3">
              <NumField label="Vit C (mg)" value={micros.vitaminC} onChange={(v) => setMicros({ ...micros, vitaminC: v })} />
              <NumField label="Vit D (mcg)" value={micros.vitaminD} onChange={(v) => setMicros({ ...micros, vitaminD: v })} />
              <NumField label="Iron (mg)" value={micros.iron} onChange={(v) => setMicros({ ...micros, iron: v })} />
              <NumField label="Calcium (mg)" value={micros.calcium} onChange={(v) => setMicros({ ...micros, calcium: v })} />
              <NumField label="Potassium (mg)" value={micros.potassium} onChange={(v) => setMicros({ ...micros, potassium: v })} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800"
      />
    </div>
  );
}

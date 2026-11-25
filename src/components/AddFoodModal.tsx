import { useState } from 'react';
import { X } from 'lucide-react';
import type { FoodItem, Micronutrients } from '@/types';

interface Props {
  open: boolean;
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

const empty: {
  name: string;
  category: FoodItem['category'];
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: Micronutrients;
} = {
  name: '',
  category: 'Protein',
  servingSize: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  micronutrients: { vitaminC: 0, vitaminD: 0, iron: 0, calcium: 0, potassium: 0 },
};

export default function AddFoodModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(form);
      setForm(empty);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Add Custom Food</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tofu Stir-fry"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as FoodItem['category'] })}
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
              value={form.servingSize}
              onChange={(e) => setForm({ ...form, servingSize: e.target.value })}
              placeholder="e.g. 1 cup"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <NumField label="Cal" value={form.calories} onChange={(v) => setForm({ ...form, calories: v })} />
            <NumField label="Protein" value={form.protein} onChange={(v) => setForm({ ...form, protein: v })} />
            <NumField label="Carbs" value={form.carbs} onChange={(v) => setForm({ ...form, carbs: v })} />
            <NumField label="Fat" value={form.fat} onChange={(v) => setForm({ ...form, fat: v })} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Micronutrients (per serving)</p>
            <div className="grid grid-cols-3 gap-3">
              <NumField label="Vit C (mg)" value={form.micronutrients.vitaminC} onChange={(v) => setForm({ ...form, micronutrients: { ...form.micronutrients, vitaminC: v } })} />
              <NumField label="Vit D (mcg)" value={form.micronutrients.vitaminD} onChange={(v) => setForm({ ...form, micronutrients: { ...form.micronutrients, vitaminD: v } })} />
              <NumField label="Iron (mg)" value={form.micronutrients.iron} onChange={(v) => setForm({ ...form, micronutrients: { ...form.micronutrients, iron: v } })} />
              <NumField label="Calcium (mg)" value={form.micronutrients.calcium} onChange={(v) => setForm({ ...form, micronutrients: { ...form.micronutrients, calcium: v } })} />
              <NumField label="Potassium (mg)" value={form.micronutrients.potassium} onChange={(v) => setForm({ ...form, micronutrients: { ...form.micronutrients, potassium: v } })} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.servingSize}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm disabled:opacity-60"
          >
            {saving ? 'Adding...' : 'Add Food'}
          </button>
        </div>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
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

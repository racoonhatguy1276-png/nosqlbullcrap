import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { DailyTargets } from '@/types';

interface Props {
  open: boolean;
  targets: DailyTargets;
  onClose: () => void;
  onSave: (t: DailyTargets) => Promise<void>;
}

const FIELDS: { key: keyof DailyTargets; label: string; unit: string }[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
  { key: 'vitaminD', label: 'Vitamin D', unit: 'mcg' },
  { key: 'iron', label: 'Iron', unit: 'mg' },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'potassium', label: 'Potassium', unit: 'mg' },
];

export default function EditTargetsModal({ open, targets, onClose, onSave }: Props) {
  const [form, setForm] = useState<DailyTargets>(targets);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(targets);
  }, [open, targets]);

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Daily Targets</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {f.label} <span className="text-slate-400 font-normal">({f.unit})</span>
              </label>
              <input
                type="number"
                min={0}
                value={form[f.key]}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800"
              />
            </div>
          ))}
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
            {saving ? 'Saving...' : 'Save Targets'}
          </button>
        </div>
      </div>
    </div>
  );
}

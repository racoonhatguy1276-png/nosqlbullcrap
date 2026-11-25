import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Apple, Minus, Trash2, Loader2, Target } from 'lucide-react';
import {
  fetchUser,
  fetchFoods,
  fetchTodayLog,
  addEntry,
  updateEntry,
  removeEntry,
  updateFood,
  createFood,
  updateTargets,
} from '@/lib/dataApi';
import type { DailyLog, FoodItem, Totals, User } from '@/types';
import { EMPTY_TOTALS } from '@/types';
import CalorieRing from '@/components/CalorieRing';
import ProgressBar from '@/components/ProgressBar';
import FoodCard from '@/components/FoodCard';
import EditTargetsModal from '@/components/EditTargetsModal';
import EditFoodModal from '@/components/EditFoodModal';
import AddFoodModal from '@/components/AddFoodModal';
import InspectorDrawer from '@/components/InspectorDrawer';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const targets = user?.dailyTargets;
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [search, setSearch] = useState('');
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [busyEntry, setBusyEntry] = useState<string | null>(null);

  const [showTargets, setShowTargets] = useState(false);
  const [editFood, setEditFood] = useState<FoodItem | null>(null);
  const [showAddFood, setShowAddFood] = useState(false);

  const totals: Totals = log?.totals ?? EMPTY_TOTALS;

  const loadFoods = useCallback(async () => {
    setLoadingFoods(true);
    try {
      setFoods(await fetchFoods());
    } finally {
      setLoadingFoods(false);
    }
  }, []);

  const loadLog = useCallback(async () => {
    setLog(await fetchTodayLog());
  }, []);

  const loadUser = useCallback(async () => {
    setUser(await fetchUser());
  }, []);

  useEffect(() => {
    loadUser();
    loadFoods();
    loadLog();
  }, [loadUser, loadFoods, loadLog]);

  async function handleLog(food: FoodItem) {
    setLoggingId(food._id);
    try {
      const updated = await addEntry(food._id, 1);
      setLog(updated);
    } finally {
      setLoggingId(null);
    }
  }

  async function handleEntryAction(entryId: string, action: 'increment' | 'decrement') {
    setBusyEntry(entryId);
    try {
      const updated = await updateEntry(entryId, action);
      setLog(updated);
    } finally {
      setBusyEntry(null);
    }
  }

  async function handleRemoveEntry(entryId: string) {
    setBusyEntry(entryId);
    try {
      const updated = await removeEntry(entryId);
      setLog(updated);
    } finally {
      setBusyEntry(null);
    }
  }

  async function handleSaveFood(data: {
    name: string;
    category: FoodItem['category'];
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    micronutrients: FoodItem['micronutrients'];
  }) {
    if (!editFood) return;
    const updated = await updateFood(editFood._id, data);
    setFoods((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
  }

  async function handleAddFood(data: {
    name: string;
    category: FoodItem['category'];
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    micronutrients: FoodItem['micronutrients'];
  }) {
    const created = await createFood(data);
    setFoods((prev) => [...prev, created]);
  }

  async function handleSaveTargets(t: NonNullable<typeof targets>) {
    const updated = await updateTargets(t);
    setUser(updated);
  }

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || !targets) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block leading-tight">NutriTrack</span>
              <span className="text-[11px] text-slate-400">Calorie & Micronutrition</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:inline">Hi, {user?.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Calories + macros */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-500 mb-3">Today's Calories</h2>
            <div className="flex items-center justify-center">
              <CalorieRing value={totals.calories} target={targets.calories} />
            </div>
            <div className="mt-4 space-y-2">
              <ProgressBar value={totals.protein} target={targets.protein} label="Protein" unit="g" />
              <ProgressBar value={totals.carbs} target={targets.carbs} label="Carbs" unit="g" />
              <ProgressBar value={totals.fat} target={targets.fat} label="Fat" unit="g" />
            </div>
          </div>

          {/* Micronutrients */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-500">Micronutrients</h2>
              <button
                onClick={() => setShowTargets(true)}
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                <Target className="w-3.5 h-3.5" /> Edit Targets
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <ProgressBar value={totals.vitaminC} target={targets.vitaminC} label="Vitamin C" unit="mg" />
              <ProgressBar value={totals.vitaminD} target={targets.vitaminD} label="Vitamin D" unit="mcg" />
              <ProgressBar value={totals.iron} target={targets.iron} label="Iron" unit="mg" />
              <ProgressBar value={totals.calcium} target={targets.calcium} label="Calcium" unit="mg" />
              <ProgressBar value={totals.potassium} target={targets.potassium} label="Potassium" unit="mg" />
            </div>
          </div>
        </div>

        {/* Two columns: food library + today's log */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Food Library */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-800">Food Library</h2>
              <button
                onClick={() => setShowAddFood(true)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Custom Food
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search foods..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-slate-800"
              />
            </div>

            {loadingFoods ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredFoods.map((food) => (
                  <FoodCard
                    key={food._id}
                    food={food}
                    onLog={handleLog}
                    onEdit={setEditFood}
                    logging={loggingId === food._id}
                  />
                ))}
                {filteredFoods.length === 0 && (
                  <p className="text-sm text-slate-400 col-span-full py-8 text-center">
                    No foods match your search.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Today's Log */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-800 mb-3">
              Today's Log
              <span className="text-sm font-normal text-slate-400 ml-2">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
              {log && log.entries.length > 0 ? (
                log.entries.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{entry.name}</p>
                      <p className="text-xs text-slate-400">
                        {Math.round(entry.calories)} cal · {Math.round(entry.protein * 10) / 10}g protein
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEntryAction(entry._id, 'decrement')}
                        disabled={busyEntry === entry._id}
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 flex items-center justify-center text-slate-600 disabled:opacity-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-semibold text-slate-700 w-8 text-center">
                        {entry.servings}
                      </span>
                      <button
                        onClick={() => handleEntryAction(entry._id, 'increment')}
                        disabled={busyEntry === entry._id}
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 flex items-center justify-center text-slate-600 disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveEntry(entry._id)}
                        disabled={busyEntry === entry._id}
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 disabled:opacity-50 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">
                  Nothing logged yet. Hit the <span className="font-semibold text-emerald-600">+ Log</span> button on a food to start.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      <EditTargetsModal
        open={showTargets}
        targets={targets}
        onClose={() => setShowTargets(false)}
        onSave={handleSaveTargets}
      />
      <EditFoodModal
        open={!!editFood}
        food={editFood}
        onClose={() => setEditFood(null)}
        onSave={handleSaveFood}
      />
      <AddFoodModal
        open={showAddFood}
        onClose={() => setShowAddFood(false)}
        onSave={handleAddFood}
      />

      {/* Inspector */}
      <InspectorDrawer />
    </div>
  );
}

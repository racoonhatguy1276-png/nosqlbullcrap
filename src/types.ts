export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitaminC: number;
  vitaminD: number;
  iron: number;
  calcium: number;
  potassium: number;
}

export interface Micronutrients {
  vitaminC: number;
  vitaminD: number;
  iron: number;
  calcium: number;
  potassium: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  dailyTargets: DailyTargets;
}

export interface FoodItem {
  _id: string;
  userId: string;
  name: string;
  category: 'Protein' | 'Carbs' | 'Veg' | 'Fruit' | 'Dairy' | 'Nuts';
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: Micronutrients;
  isDefaultSeed: boolean;
  updatedAt?: string;
}

export interface LogEntry {
  _id: string;
  foodId: string;
  name: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: Micronutrients;
}

export interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitaminC: number;
  vitaminD: number;
  iron: number;
  calcium: number;
  potassium: number;
}

export interface DailyLog {
  _id: string;
  userId: string;
  date: string;
  entries: LogEntry[];
  totals: Totals;
}

export interface InspectorEntry {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  operator: string;
  data: unknown;
  status: number;
}

export const EMPTY_TOTALS: Totals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  vitaminC: 0,
  vitaminD: 0,
  iron: 0,
  calcium: 0,
  potassium: 0,
};

export const DEFAULT_TARGETS: DailyTargets = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  vitaminC: 90,
  vitaminD: 20,
  iron: 18,
  calcium: 1000,
  potassium: 3500,
};

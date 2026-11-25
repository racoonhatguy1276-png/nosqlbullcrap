import mongoose from 'mongoose';

const DEFAULT_TARGETS = {
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

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    dailyTargets: {
      calories: { type: Number, default: DEFAULT_TARGETS.calories },
      protein: { type: Number, default: DEFAULT_TARGETS.protein },
      carbs: { type: Number, default: DEFAULT_TARGETS.carbs },
      fat: { type: Number, default: DEFAULT_TARGETS.fat },
      vitaminC: { type: Number, default: DEFAULT_TARGETS.vitaminC },
      vitaminD: { type: Number, default: DEFAULT_TARGETS.vitaminD },
      iron: { type: Number, default: DEFAULT_TARGETS.iron },
      calcium: { type: Number, default: DEFAULT_TARGETS.calcium },
      potassium: { type: Number, default: DEFAULT_TARGETS.potassium },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
export { DEFAULT_TARGETS };

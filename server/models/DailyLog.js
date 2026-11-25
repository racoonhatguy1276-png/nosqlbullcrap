import mongoose from 'mongoose';

const totalsSchema = {
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  vitaminC: { type: Number, default: 0 },
  vitaminD: { type: Number, default: 0 },
  iron: { type: Number, default: 0 },
  calcium: { type: Number, default: 0 },
  potassium: { type: Number, default: 0 },
};

const entrySchema = {
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
  name: { type: String, required: true },
  servings: { type: Number, required: true, default: 1, min: 0.25 },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  micronutrients: {
    vitaminC: { type: Number, default: 0 },
    vitaminD: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
  },
};

const dailyLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    entries: [entrySchema],
    totals: totalsSchema,
  },
  { timestamps: true }
);

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyLog = mongoose.model('DailyLog', dailyLogSchema);

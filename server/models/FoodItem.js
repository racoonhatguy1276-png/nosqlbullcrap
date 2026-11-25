import mongoose from 'mongoose';

const micronutrientSchema = {
  vitaminC: { type: Number, default: 0 },
  vitaminD: { type: Number, default: 0 },
  iron: { type: Number, default: 0 },
  calcium: { type: Number, default: 0 },
  potassium: { type: Number, default: 0 },
};

const foodItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Protein', 'Carbs', 'Veg', 'Fruit', 'Dairy', 'Nuts'],
      required: true,
    },
    servingSize: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbs: { type: Number, required: true, min: 0 },
    fat: { type: Number, required: true, min: 0 },
    micronutrients: micronutrientSchema,
    isDefaultSeed: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const FoodItem = mongoose.model('FoodItem', foodItemSchema);

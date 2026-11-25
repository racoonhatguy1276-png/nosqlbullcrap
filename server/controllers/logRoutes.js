import { Router } from 'express';
import { DailyLog } from '../models/DailyLog.js';
import { FoodItem } from '../models/FoodItem.js';
import { getDefaultUserId } from '../utils/defaultUser.js';

const router = Router();

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// GET /api/logs/today — fetch today's log (creates empty doc if none yet)
router.get('/today', async (req, res) => {
  try {
    const date = todayStr();
    let log = await DailyLog.findOne({ userId: getDefaultUserId(), date });
    if (!log) {
      log = await DailyLog.create({
        userId: getDefaultUserId(),
        date,
        entries: [],
        totals: {},
      });
    }
    res.json({ log });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch log', error: err.message });
  }
});

// PATCH /api/logs/today/add
// MongoDB operators: $push (append entry) + $inc (atomic totals update) + upsert: true
router.patch('/today/add', async (req, res) => {
  try {
    const { foodId, servings } = req.body;
    const numServings = Number(servings) || 1;
    if (!foodId) {
      return res.status(400).json({ message: 'foodId is required' });
    }

    const food = await FoodItem.findOne({ _id: foodId, userId: getDefaultUserId() });
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    const entry = {
      foodId: food._id,
      name: food.name,
      servings: numServings,
      calories: food.calories * numServings,
      protein: food.protein * numServings,
      carbs: food.carbs * numServings,
      fat: food.fat * numServings,
      micronutrients: {
        vitaminC: food.micronutrients.vitaminC * numServings,
        vitaminD: food.micronutrients.vitaminD * numServings,
        iron: food.micronutrients.iron * numServings,
        calcium: food.micronutrients.calcium * numServings,
        potassium: food.micronutrients.potassium * numServings,
      },
    };

    const date = todayStr();
    // MongoDB operator: $push to append entry + $inc to atomically bump totals.
    // upsert: true creates the log doc for today if it does not yet exist.
    const updated = await DailyLog.findOneAndUpdate(
      { userId: getDefaultUserId(), date },
      {
        $push: { entries: entry },
        $inc: {
          'totals.calories': entry.calories,
          'totals.protein': entry.protein,
          'totals.carbs': entry.carbs,
          'totals.fat': entry.fat,
          'totals.vitaminC': entry.micronutrients.vitaminC,
          'totals.vitaminD': entry.micronutrients.vitaminD,
          'totals.iron': entry.micronutrients.iron,
          'totals.calcium': entry.micronutrients.calcium,
          'totals.potassium': entry.micronutrients.potassium,
        },
      },
      { new: true, upsert: true }
    );

    res.json({
      operator: 'findOneAndUpdate with $push + $inc (upsert: true)',
      log: updated,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add entry', error: err.message });
  }
});

// PATCH /api/logs/today/entry/:entryId
// MongoDB operators: positional $ to update a specific array element,
// $set to change the serving count and recalculated entry fields,
// $inc to adjust totals by the delta.
router.patch('/today/entry/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;
    const { action } = req.body; // "increment" | "decrement"
    const delta = action === 'decrement' ? -1 : 1;

    const date = todayStr();
    const log = await DailyLog.findOne({ userId: getDefaultUserId(), date });
    if (!log) {
      return res.status(404).json({ message: "Today's log not found" });
    }
    const idx = log.entries.findIndex((e) => e._id.toString() === entryId);
    if (idx === -1) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    const entry = log.entries[idx];
    const newServings = Math.max(0, entry.servings + delta);
    if (newServings === 0) {
      // serving 0 => remove the entry instead
      const pulled = await DailyLog.findOneAndUpdate(
        { userId: getDefaultUserId(), date },
        {
          $pull: { entries: { _id: entry._id } },
          $inc: {
            'totals.calories': -entry.calories,
            'totals.protein': -entry.protein,
            'totals.carbs': -entry.carbs,
            'totals.fat': -entry.fat,
            'totals.vitaminC': -entry.micronutrients.vitaminC,
            'totals.vitaminD': -entry.micronutrients.vitaminD,
            'totals.iron': -entry.micronutrients.iron,
            'totals.calcium': -entry.micronutrients.calcium,
            'totals.potassium': -entry.micronutrients.potassium,
          },
        },
        { new: true }
      );
      return res.json({
        operator: 'findOneAndUpdate with $pull + $inc (serving reached 0)',
        log: pulled,
      });
    }

    // Per-serving values from the stored entry
    const per = {
      calories: entry.calories / entry.servings,
      protein: entry.protein / entry.servings,
      carbs: entry.carbs / entry.servings,
      fat: entry.fat / entry.servings,
      vitaminC: entry.micronutrients.vitaminC / entry.servings,
      vitaminD: entry.micronutrients.vitaminD / entry.servings,
      iron: entry.micronutrients.iron / entry.servings,
      calcium: entry.micronutrients.calcium / entry.servings,
      potassium: entry.micronutrients.potassium / entry.servings,
    };

    const newCalories = per.calories * newServings;
    const newProtein = per.protein * newServings;
    const newCarbs = per.carbs * newServings;
    const newFat = per.fat * newServings;
    const newVitC = per.vitaminC * newServings;
    const newVitD = per.vitaminD * newServings;
    const newIron = per.iron * newServings;
    const newCalcium = per.calcium * newServings;
    const newPot = per.potassium * newServings;

    // The positional $ operator targets the matched array element.
    const updated = await DailyLog.findOneAndUpdate(
      { userId: getDefaultUserId(), date, 'entries._id': entry._id },
      {
        $set: {
          [`entries.$.servings`]: newServings,
          [`entries.$.calories`]: newCalories,
          [`entries.$.protein`]: newProtein,
          [`entries.$.carbs`]: newCarbs,
          [`entries.$.fat`]: newFat,
          [`entries.$.micronutrients.vitaminC`]: newVitC,
          [`entries.$.micronutrients.vitaminD`]: newVitD,
          [`entries.$.micronutrients.iron`]: newIron,
          [`entries.$.micronutrients.calcium`]: newCalcium,
          [`entries.$.micronutrients.potassium`]: newPot,
        },
        $inc: {
          'totals.calories': newCalories - entry.calories,
          'totals.protein': newProtein - entry.protein,
          'totals.carbs': newCarbs - entry.carbs,
          'totals.fat': newFat - entry.fat,
          'totals.vitaminC': newVitC - entry.micronutrients.vitaminC,
          'totals.vitaminD': newVitD - entry.micronutrients.vitaminD,
          'totals.iron': newIron - entry.micronutrients.iron,
          'totals.calcium': newCalcium - entry.micronutrients.calcium,
          'totals.potassium': newPot - entry.micronutrients.potassium,
        },
      },
      { new: true }
    );

    res.json({
      operator: 'findOneAndUpdate with positional $ + $set + $inc',
      log: updated,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update entry', error: err.message });
  }
});

// PATCH /api/logs/today/remove/:entryId
// MongoDB operators: $pull (remove entry) + $inc (decrement totals)
router.patch('/today/remove/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;
    const date = todayStr();

    const log = await DailyLog.findOne({ userId: getDefaultUserId(), date });
    if (!log) {
      return res.status(404).json({ message: "Today's log not found" });
    }
    const entry = log.entries.find((e) => e._id.toString() === entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const updated = await DailyLog.findOneAndUpdate(
      { userId: getDefaultUserId(), date },
      {
        $pull: { entries: { _id: entry._id } },
        $inc: {
          'totals.calories': -entry.calories,
          'totals.protein': -entry.protein,
          'totals.carbs': -entry.carbs,
          'totals.fat': -entry.fat,
          'totals.vitaminC': -entry.micronutrients.vitaminC,
          'totals.vitaminD': -entry.micronutrients.vitaminD,
          'totals.iron': -entry.micronutrients.iron,
          'totals.calcium': -entry.micronutrients.calcium,
          'totals.potassium': -entry.micronutrients.potassium,
        },
      },
      { new: true }
    );

    res.json({
      operator: 'findOneAndUpdate with $pull + $inc',
      log: updated,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove entry', error: err.message });
  }
});

export default router;

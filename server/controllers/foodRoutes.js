import { Router } from 'express';
import { FoodItem } from '../models/FoodItem.js';
import { getDefaultUserId } from '../utils/defaultUser.js';

const router = Router();

// GET /api/foods — all foods for the logged-in user
router.get('/', async (req, res) => {
  try {
    const foods = await FoodItem.find({ userId: getDefaultUserId() }).sort({ name: 1 });
    res.json({ foods });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch foods', error: err.message });
  }
});

// POST /api/foods — add a custom food
router.post('/', async (req, res) => {
  try {
    const { name, category, servingSize, calories, protein, carbs, fat, micronutrients } = req.body;
    if (!name || !category || !servingSize) {
      return res.status(400).json({ message: 'Name, category, and serving size are required' });
    }
    const food = await FoodItem.create({
      userId: getDefaultUserId(),
      name,
      category,
      servingSize,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      micronutrients: micronutrients || {},
      isDefaultSeed: false,
    });
    res.status(201).json({ food });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create food', error: err.message });
  }
});

// PUT /api/foods/:id — $set: edit name/serving/macros/micros for the logged-in user
// Demonstrates MongoDB $set via findOneAndUpdate with { new: true }
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      category,
      servingSize,
      calories,
      protein,
      carbs,
      fat,
      micronutrients,
    } = req.body;

    const setFields = {
      // flag that the food has been customized from the seed
      isDefaultSeed: false,
      updatedAt: new Date(),
    };
    if (name !== undefined) setFields.name = name;
    if (category !== undefined) setFields.category = category;
    if (servingSize !== undefined) setFields.servingSize = servingSize;
    if (calories !== undefined) setFields.calories = calories;
    if (protein !== undefined) setFields.protein = protein;
    if (carbs !== undefined) setFields.carbs = carbs;
    if (fat !== undefined) setFields.fat = fat;
    if (micronutrients !== undefined) setFields['micronutrients'] = micronutrients;

    const updated = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, userId: getDefaultUserId() },
      // MongoDB operator: $set
      { $set: setFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({
      operator: 'findOneAndUpdate with $set',
      food: updated,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update food', error: err.message });
  }
});

// DELETE /api/foods/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await FoodItem.findOneAndDelete({
      _id: req.params.id,
      userId: getDefaultUserId(),
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({ message: 'Food deleted', food: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete food', error: err.message });
  }
});

export default router;

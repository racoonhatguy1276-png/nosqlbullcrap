import { Router } from 'express';
import { User } from '../models/User.js';
import { getDefaultUserId } from '../utils/defaultUser.js';

const router = Router();

// GET /api/user/me — default user profile + targets
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(getDefaultUserId()).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// PUT /api/user/targets — $set the default user's personal daily goals
// Demonstrates MongoDB $set on nested dailyTargets fields.
router.put('/targets', async (req, res) => {
  try {
    const { calories, protein, carbs, fat, vitaminC, vitaminD, iron, calcium, potassium } = req.body;
    const setFields = {};
    if (calories !== undefined) setFields['dailyTargets.calories'] = calories;
    if (protein !== undefined) setFields['dailyTargets.protein'] = protein;
    if (carbs !== undefined) setFields['dailyTargets.carbs'] = carbs;
    if (fat !== undefined) setFields['dailyTargets.fat'] = fat;
    if (vitaminC !== undefined) setFields['dailyTargets.vitaminC'] = vitaminC;
    if (vitaminD !== undefined) setFields['dailyTargets.vitaminD'] = vitaminD;
    if (iron !== undefined) setFields['dailyTargets.iron'] = iron;
    if (calcium !== undefined) setFields['dailyTargets.calcium'] = calcium;
    if (potassium !== undefined) setFields['dailyTargets.potassium'] = potassium;

    const updated = await User.findOneAndUpdate(
      { _id: getDefaultUserId() },
      // MongoDB operator: $set on nested dailyTargets.* fields
      { $set: setFields },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      operator: 'findOneAndUpdate with $set (dailyTargets)',
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update targets', error: err.message });
  }
});

export default router;

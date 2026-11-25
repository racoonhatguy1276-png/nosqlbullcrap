import { User, DEFAULT_TARGETS } from '../models/User.js';
import { FoodItem } from '../models/FoodItem.js';
import { seedFoodsForUser } from './seedFoods.js';

let defaultUserId = null;

// Single-user local mode: ensure a default user doc and the 12 seed foods exist.
// Called once on server startup; routes read the cached id.
export async function ensureDefaultUser() {
  let user = await User.findOne({ email: 'local@nutritrack.app' });
  if (!user) {
    user = await User.create({
      name: 'Local User',
      email: 'local@nutritrack.app',
      password: 'disabled-no-auth-mode',
      dailyTargets: { ...DEFAULT_TARGETS },
    });
  }

  const foodCount = await FoodItem.countDocuments({ userId: user._id });
  if (foodCount === 0) {
    await seedFoodsForUser(user._id);
  }

  defaultUserId = user._id;
  return user;
}

export function getDefaultUserId() {
  if (!defaultUserId) {
    throw new Error('Default user not initialized');
  }
  return defaultUserId;
}

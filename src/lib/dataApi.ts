import { api } from './api';
import { pushInspectorEntry } from './inspectorStore';
import type { DailyLog, FoodItem, Micronutrients, User } from '@/types';

function record(method: string, url: string, data: unknown, status: number, operator?: string) {
  pushInspectorEntry({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    method,
    url,
    operator: operator || '—',
    data,
    status,
  });
}

export async function fetchUser(): Promise<User> {
  const res = await api.get('/user/me');
  record('GET', '/api/user/me', res.data, res.status, 'findOne');
  const u = res.data.user;
  return { id: u._id ?? u.id, name: u.name, email: u.email, dailyTargets: u.dailyTargets };
}

export async function fetchFoods(): Promise<FoodItem[]> {
  const res = await api.get('/foods');
  record('GET', '/api/foods', res.data, res.status, 'find()');
  return res.data.foods as FoodItem[];
}

export async function createFood(payload: {
  name: string;
  category: FoodItem['category'];
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: Micronutrients;
}): Promise<FoodItem> {
  const res = await api.post('/foods', payload);
  record('POST', '/api/foods', res.data, res.status, 'create');
  return res.data.food as FoodItem;
}

export async function updateFood(
  id: string,
  payload: Partial<{
    name: string;
    category: FoodItem['category'];
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    micronutrients: Micronutrients;
  }>
): Promise<FoodItem> {
  const res = await api.put(`/foods/${id}`, payload);
  record('PUT', `/api/foods/${id}`, res.data, res.status, res.data.operator);
  return res.data.food as FoodItem;
}

export async function deleteFood(id: string): Promise<void> {
  const res = await api.delete(`/foods/${id}`);
  record('DELETE', `/api/foods/${id}`, res.data, res.status, 'findOneAndDelete');
}

export async function fetchTodayLog(): Promise<DailyLog> {
  const res = await api.get('/logs/today');
  record('GET', '/api/logs/today', res.data, res.status, 'findOne / create');
  return res.data.log as DailyLog;
}

export async function addEntry(foodId: string, servings: number): Promise<DailyLog> {
  const res = await api.patch('/logs/today/add', { foodId, servings });
  record('PATCH', '/api/logs/today/add', res.data, res.status, res.data.operator);
  return res.data.log as DailyLog;
}

export async function updateEntry(
  entryId: string,
  action: 'increment' | 'decrement'
): Promise<DailyLog> {
  const res = await api.patch(`/logs/today/entry/${entryId}`, { action });
  record('PATCH', `/api/logs/today/entry/${entryId}`, res.data, res.status, res.data.operator);
  return res.data.log as DailyLog;
}

export async function removeEntry(entryId: string): Promise<DailyLog> {
  const res = await api.patch(`/logs/today/remove/${entryId}`, {});
  record('PATCH', `/api/logs/today/remove/${entryId}`, res.data, res.status, res.data.operator);
  return res.data.log as DailyLog;
}

export async function updateTargets(payload: Partial<User['dailyTargets']>): Promise<User> {
  const res = await api.put('/user/targets', payload);
  record('PUT', '/api/user/targets', res.data, res.status, res.data.operator);
  const u = res.data.user;
  return { id: u._id ?? u.id, name: u.name, email: u.email, dailyTargets: u.dailyTargets };
}

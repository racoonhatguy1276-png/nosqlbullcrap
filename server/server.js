import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import foodRoutes from './controllers/foodRoutes.js';
import logRoutes from './controllers/logRoutes.js';
import userRoutes from './controllers/userRoutes.js';
import { ensureDefaultUser } from './utils/defaultUser.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/foods', foodRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/user', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Copy .env.example to .env and configure it.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await ensureDefaultUser();
    console.log('Default user and seed foods ready');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

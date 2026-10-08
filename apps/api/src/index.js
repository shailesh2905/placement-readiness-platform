import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import readinessRoutes from './routes/readiness.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/student/profile', profileRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/readiness', readinessRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

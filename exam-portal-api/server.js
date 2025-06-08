import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './api/users.js';
import questionRoutes from './api/questions.js';
import resultRoutes from './api/results.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

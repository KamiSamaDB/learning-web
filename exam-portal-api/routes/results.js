import express from 'express';
import Result from '../models/Result.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: API for managing exam results
 */

/**
 * @swagger
 * /results:
 *   get:
 *     summary: Get all results
 *     tags: [Results]
 *     responses:
 *       200:
 *         description: List of results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 *   post:
 *     summary: Add a result
 *     tags: [Results]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Result'
 *     responses:
 *       200:
 *         description: The created result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Result:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         marks:
 *           type: number
 *         date:
 *           type: string
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctIndex:
 *                 type: integer
 *               selectedIndex:
 *                 type: integer
 */

router.get('/', async (req, res) => {
  const results = await Result.find();
  res.json(results);
});

router.post('/', async (req, res) => {
  const result = await Result.create(req.body);
  res.json(result);
});

export default router;
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Register or login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user object (created or found)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: The user role
 *         password:
 *           type: string
 *           description: The password (optional)
 *       example:
 *         _id: 60c72b2f9b1e8e001c8e4b8a
 *         username: johndoe
 *         role: user
 *         password: mypassword
 */

router.post('/login', async (req, res) => {
  const { username, role } = req.body;
  let user = await User.findOne({ username });
  if (!user) {
    user = await User.create({ username, role });
  }
  res.json(user);
});

export default router;
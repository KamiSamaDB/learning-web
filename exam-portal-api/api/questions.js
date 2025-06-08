import { dbConnect } from '../utils/db.js';
import Question from '../models/Question.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await dbConnect();

  if (req.method === 'GET') {
    const questions = await Question.find();
    return res.status(200).json(questions);
  }

  if (req.method === 'POST') {
    const question = await Question.create(req.body);
    return res.status(200).json(question);
  }

  if (req.method === 'PUT') {
    const { id, ...update } = req.body;
    const question = await Question.findByIdAndUpdate(id, update, { new: true });
    return res.status(200).json(question);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Question.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
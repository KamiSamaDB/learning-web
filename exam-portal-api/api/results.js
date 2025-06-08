import { dbConnect } from '../utils/db.js';
import Result from '../models/Result.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const results = await Result.find();
    return res.status(200).json(results);
  }

  if (req.method === 'POST') {
    const result = await Result.create(req.body);
    return res.status(200).json(result);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
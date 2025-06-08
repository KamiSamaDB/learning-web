import { dbConnect } from '../utils/db.js';
import Result from '../models/Result.js';

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
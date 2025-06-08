import { dbConnect } from '../utils/db.js';
import Result from '../models/Result.js';

export default async function handler(req, res) {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // or use specific origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // No Content
  }

  await dbConnect();

  try {
    if (req.method === 'GET') {
      const results = await Result.find();
      return res.status(200).json(results);
    }

    if (req.method === 'POST') {
      const result = await Result.create(req.body);
      return res.status(200).json(result);
    }

    // If method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

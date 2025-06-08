import { dbConnect } from '../utils/db.js';
import User from '../models/User.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await dbConnect();

  if (req.method === 'POST') {
    const { username, role } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username, role });
    }
    return res.status(200).json(user);
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
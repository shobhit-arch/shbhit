import jwt from 'jsonwebtoken';
import { findUserByEmail, JWT_SECRET, setCorsHeaders } from './_utils.js';

export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  const user = findUserByEmail(email);
  if (!user || password.trim() !== user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
}

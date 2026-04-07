import { users, verifyToken, setCorsHeaders } from './_utils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = await verifyToken(token);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized / Session Expired' });
  }
}

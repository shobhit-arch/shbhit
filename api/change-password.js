import { users, verifyToken, setCorsHeaders } from './_utils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = await verifyToken(token);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { oldPassword, newPassword } = req.body || {};
    if (user.password !== oldPassword?.trim()) {
      return res.status(400).json({ message: 'Current password does not match' });
    }
    user.password = newPassword.trim();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized / Session Expired' });
  }
}

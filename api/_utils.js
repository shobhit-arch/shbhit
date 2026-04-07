import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const users = [
  { id: 0, email: 'root@ehs.com', password: 'root', role: 'Admin', name: 'System Root' },
  { id: 1, email: 'admin@ehs.com', password: 'EHS_Admin_2026', role: 'Admin', name: 'Dashboard Admin' },
  { id: 2, email: 'manager@ehs.com', password: 'EHS_Admin_2026', role: 'Manager', name: 'Team Manager' },
  { id: 3, email: 'finance@ehs.com', password: 'EHS_Admin_2026', role: 'Admin', name: 'Finance Director' },
  { id: 4, email: 'client@ehs.com', password: 'EHS_Admin_2026', role: 'Manager', name: 'Key Account Partner' },
  { id: 5, email: 'analyst@ehs.com', password: 'EHS_Admin_2026', role: 'Manager', name: 'Data Analyst' },
];

export function findUserByEmail(email) {
  if (!email) return null;
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

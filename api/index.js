import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Users
const users = [
  { id: 0, email: 'root@ehs.com', password: 'root', role: 'Admin', name: 'System Root' },
  { id: 1, email: 'admin@ehs.com', password: 'EHS_Admin_2026', role: 'Admin', name: 'Dashboard Admin' },
  { id: 2, email: 'manager@ehs.com', password: 'EHS_Admin_2026', role: 'Manager', name: 'Team Manager' },
  { id: 3, email: 'finance@ehs.com', password: 'EHS_Admin_2026', role: 'Admin', name: 'Finance Director' },
  { id: 4, email: 'client@ehs.com', password: 'EHS_Admin_2026', role: 'Manager', name: 'Key Account Partner' },
  { id: 5, email: 'analyst@ehs.com', password: 'EHS_Admin_2026', role: 'Manager', name: 'Data Analyst' },
];

const findUserByEmail = (email) => {
  if (!email) return null;
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized / Session Expired' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// HEALTH
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// LOGIN
app.post('/api/login', (req, res) => {
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

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
});

// CHANGE PASSWORD
app.post('/api/change-password', verifyToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.password !== oldPassword?.trim()) {
    return res.status(400).json({ message: 'Current password does not match' });
  }
  user.password = newPassword.trim();
  res.json({ message: 'Password updated successfully' });
});

// VERIFY SESSION
app.get('/api/verify', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    user: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
});

export default app;

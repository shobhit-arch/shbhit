const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DIAGNOSTIC LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`[Diagnostic] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`[Diagnostic] Headers:`, JSON.stringify(req.headers, null, 2));
  if (req.method === 'POST') {
    console.log(`[Diagnostic] Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

// Hardcoded Users (Unified Password: EHS_Admin_2026)
let users = [
  {
    id: 0,
    email: 'root@ehs.com',
    password: 'root',
    role: 'Admin',
    name: 'System Root'
  },
  {
    id: 1,
    email: 'admin@ehs.com',
    password: 'EHS_Admin_2026',
    role: 'Admin',
    name: 'Dashboard Admin'
  },
  {
    id: 2,
    email: 'manager@ehs.com',
    password: 'EHS_Admin_2026',
    role: 'Manager',
    name: 'Team Manager'
  },
  {
    id: 3,
    email: 'finance@ehs.com',
    password: 'EHS_Admin_2026',
    role: 'Admin',
    name: 'Finance Director'
  },
  {
    id: 4,
    email: 'client@ehs.com',
    password: 'EHS_Admin_2026',
    role: 'Manager',
    name: 'Key Account Partner'
  },
  {
    id: 5,
    email: 'analyst@ehs.com',
    password: 'EHS_Admin_2026',
    role: 'Manager',
    name: 'Data Analyst'
  }
];

// Helper to find user
const findUserByEmail = (email) => {
  if (!email) return null;
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
};

// HEALTH CHECK ROUTE
app.get([/.*\/health$/, '/health', '/api/health'], (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AUTH MIDDLEWARE
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

// LOGIN ROUTE
app.post([/.*\/login$/, '/login', '/api/login'], async (req, res) => {
  let email, password;

  // Extremely robust body parsing for Netlify Serverless environment (handles Base64 & strings)
  let bodyData = req.body;
  
  if (req.isBase64Encoded || (typeof bodyData === 'string' && !bodyData.startsWith('{') && !bodyData.startsWith('['))) {
    try {
      // Decode base64
      const decodedBody = Buffer.from(typeof bodyData === 'string' ? bodyData : (req.body ? req.body.toString() : ''), 'base64').toString('utf8');
      bodyData = JSON.parse(decodedBody);
    } catch (e) {
      // Fallback
    }
  } else if (typeof bodyData === 'string') {
    try {
      bodyData = JSON.parse(bodyData);
    } catch (e) {
      // Just fallback
    }
  }

  email = bodyData?.email || req.body?.email;
  password = bodyData?.password || req.body?.password;

  
  if (!email || !password) {
    if (bodyData && bodyData.body && typeof bodyData.body === 'string') {
       try {
         const nested = JSON.parse(bodyData.body);
         email = nested.email || email;
         password = nested.password || password;
       } catch(e) {}
    }
  }

  // Also check query string just in case
  email = email || req.query?.email;
  password = password || req.query?.password;
  
  if (!email || !password) {
    console.log(`[Diagnostic Login FAILED] Raw Body was:`, req.body);
    return res.status(400).json({ message: 'Email and Password are required. Data missing.' });
  }

  try {
    const user = findUserByEmail(email);
    if (!user) {
      console.log(`[Diagnostic] User not found: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = password.trim() === user.password;
    console.log(`[Diagnostic] Password Match for ${email}: ${isMatch}`);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error(`[Diagnostic] Server Error:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CHANGE PASSWORD ROUTE
app.post([/.*\/change-password$/, '/change-password', '/api/change-password'], verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== oldPassword.trim()) {
      return res.status(400).json({ message: 'Current password does not match' });
    }
    user.password = newPassword.trim();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PROTECTED ROUTE (Check Session)
app.get([/.*\/verify$/, '/verify', '/api/verify'], verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

// EXPLICIT BINDING TO IPv4 (127.0.0.1)
if (require.main === module) {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`[Diagnostic Mode] Auth Server running for recovery on http://127.0.0.1:${PORT}`);
  });
}

// EXPORT FOR NETLIFY
module.exports = app;

import { setCorsHeaders } from './_utils.js';

export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
}

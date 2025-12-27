export default function handler(req, res) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple hardcoded response
  return res.status(201).json({
    message: 'Register endpoint working',
    token: 'test-token-456',
    user: {
      id: '2',
      name: 'New User',
      email: 'new@example.com'
    }
  });
}
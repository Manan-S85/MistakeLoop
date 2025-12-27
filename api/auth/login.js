export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For now, return a mock successful login (to test if the endpoint works)
    // TODO: Add real authentication logic later
    if (email === 'test@test.com' && password === 'test123') {
      return res.status(200).json({
        token: 'mock-jwt-token-12345',
        user: {
          id: '12345',
          name: 'Test User',
          email: email
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
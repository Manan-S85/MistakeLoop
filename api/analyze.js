export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    message: 'Analysis endpoint working',
    analysis: {
      issues: ['Mock issue 1', 'Mock issue 2'],
      insights: ['Mock insight 1', 'Mock insight 2'],
      score: 75
    }
  });
}
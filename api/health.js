/**
 * Health check endpoint for Vercel serverless functions / monitoring.
 * GET /api/health
 */
export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY);

  const status = {
    status: 'ok',
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    timestamp: new Date().toISOString(),
    service: 'Singapore Public Transit Expressive API',
    environment: process.env.NODE_ENV || 'production',
    ltaApiConfigured: hasLtaKey,
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'API health monitor' },
      { path: '/api/bus-arrival', method: 'GET', description: 'LTA DataMall v3 Bus Arrival proxy' }
    ]
  };

  return res.status(200).json(status);
}

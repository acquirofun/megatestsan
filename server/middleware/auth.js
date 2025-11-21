// middleware/auth.js
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
  };
  
  module.exports = { validateApiKey };
  
  // middleware/rateLimit.js
  const requestCounts = new Map();
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  const MAX_REQUESTS = 100;
  
  const rateLimit = (req, res, next) => {
    const identifier = req.ip;
    const now = Date.now();
    const userRequests = requestCounts.get(identifier) || { count: 0, timestamp: now };
  
    if (now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
      userRequests.count = 0;
      userRequests.timestamp = now;
    }
  
    userRequests.count++;
    requestCounts.set(identifier, userRequests);
  
    if (userRequests.count > MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too many requests' });
    }
  
    next();
  };
  
  module.exports = { rateLimit };
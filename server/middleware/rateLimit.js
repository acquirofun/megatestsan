// middleware/rateLimit.js

const rateLimit = (() => {
    // Store request counts with timestamp and IP/user identifier
    const requests = new Map();
    
    // Configure rate limit settings
    const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
    const MAX_REQUESTS = 100; // maximum requests per window
    
    // Clean up old entries periodically
    setInterval(() => {
      const now = Date.now();
      for (const [key, data] of requests.entries()) {
        if (now - data.timestamp > WINDOW_MS) {
          requests.delete(key);
        }
      }
    }, WINDOW_MS);
  
    return (req, res, next) => {
      try {
        // Get identifier (can be IP or user ID if authenticated)
        const identifier = req.headers['x-api-key'] || req.ip;
        const now = Date.now();
  
        // Get or create request data for this identifier
        const requestData = requests.get(identifier) || {
          count: 0,
          timestamp: now
        };
  
        // Reset if window has passed
        if (now - requestData.timestamp > WINDOW_MS) {
          requestData.count = 0;
          requestData.timestamp = now;
        }
  
        // Increment request count
        requestData.count++;
  
        // Update in map
        requests.set(identifier, requestData);
  
        // Check if rate limit exceeded
        if (requestData.count > MAX_REQUESTS) {
          return res.status(429).json({
            error: 'Too many requests, please try again later',
            retryAfter: Math.ceil((requestData.timestamp + WINDOW_MS - now) / 1000)
          });
        }
  
        // Add rate limit headers
        res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - requestData.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil((requestData.timestamp + WINDOW_MS) / 1000));
  
        next();
      } catch (error) {
        console.error('Rate limit error:', error);
        next(); // Proceed even if rate limiting fails
      }
    };
  })();
  
  module.exports = { rateLimit };
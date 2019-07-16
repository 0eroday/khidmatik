const jwt = require('jsonwebtoken');
const keys = require('./keys.json');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
console.log(token);

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, keys.jwtToken);
    console.log(decoded);
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

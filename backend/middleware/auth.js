const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired, please log in again' });
    } else {
      res.status(400).json({ message: 'Token is not valid' });
    }
  }
};

module.exports = auth;

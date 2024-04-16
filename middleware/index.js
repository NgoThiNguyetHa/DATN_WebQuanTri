const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  // Lấy token từ cookie, header hoặc query parameter
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  jwt.verify(token, 'jwt_secret_key', (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Lưu thông tin từ token vào request để sử dụng trong các middleware hoặc controller sau này
    req.userId = decodedToken._id;
    req.username = decodedToken.username;
    req.diaChi = decodedToken.diaChi;
    req.email = decodedToken.email;
    req.sdt = decodedToken.sdt;

    next();
  });
};
const baseUrl = 'http://localhost:8686/';

module.exports = { baseUrl, authenticateToken };

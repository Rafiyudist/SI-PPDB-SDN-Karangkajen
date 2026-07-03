const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'si-ppdb-secret-key-2026';

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Sesi telah kedaluwarsa. Silakan login ulang.' });
    }
    return res.status(401).json({ message: 'Token tidak valid.' });
  }
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat mengakses endpoint ini.' });
  }
  next();
}

function authorizeOrtu(req, res, next) {
  if (req.user.role !== 'ortu') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin, authorizeOrtu };

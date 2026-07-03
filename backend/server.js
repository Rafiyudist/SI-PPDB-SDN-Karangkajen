require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const pendaftarRoutes = require('./routes/pendaftar');
const pengumumanRoutes = require('./routes/pengumuman');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pendaftar', pendaftarRoutes);
app.use('/api/pengumuman', pengumumanRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'SI-PPDB API is running.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan server.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

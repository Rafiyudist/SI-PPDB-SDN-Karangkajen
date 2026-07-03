const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.id, p.judul, p.isi, p.created_at, u.nama AS dibuat_oleh_nama FROM pengumuman p LEFT JOIN users u ON p.dibuat_oleh = u.id ORDER BY p.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Get pengumuman error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { judul, isi } = req.body;

    if (!judul || !judul.trim() || !isi || !isi.trim()) {
      return res.status(400).json({ message: 'Judul dan isi pengumuman wajib diisi.' });
    }

    await pool.query(
      'INSERT INTO pengumuman (judul, isi, dibuat_oleh) VALUES (?, ?, ?)',
      [judul.trim(), isi.trim(), req.user.id]
    );

    res.status(201).json({ message: 'Pengumuman berhasil dipublikasikan.' });
  } catch (err) {
    console.error('Create pengumuman error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM pengumuman WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan.' });
    }
    res.json({ message: 'Pengumuman berhasil dihapus.' });
  } catch (err) {
    console.error('Delete pengumuman error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;

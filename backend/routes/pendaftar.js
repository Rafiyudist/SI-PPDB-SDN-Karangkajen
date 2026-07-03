const express = require('express');
const path = require('path');
const pool = require('../config/database');
const { authenticate, authorizeAdmin, authorizeOrtu } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let query = `
      SELECT p.id, p.nama_siswa, p.status, p.created_at, u.email AS email_ortu, u.nama AS nama_ortu
      FROM pendaftar p
      JOIN users u ON p.user_id = u.id
    `;
    const params = [];

    if (req.user.role === 'ortu') {
      query += ' WHERE p.user_id = ?';
      params.push(req.user.id);
    } else if (req.query.status) {
      const validStatuses = ['menunggu', 'diverifikasi', 'ditolak'];
      if (validStatuses.includes(req.query.status)) {
        query += ' WHERE p.status = ?';
        params.push(req.query.status);
      }
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get pendaftar list error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.post('/', authenticate, authorizeOrtu, async (req, res) => {
  try {
    const {
      nama_siswa, tempat_lahir, tanggal_lahir, jenis_kelamin,
      alamat, nama_ayah, nama_ibu, no_hp, asal_sekolah,
    } = req.body;

    if (!nama_siswa || !nama_siswa.trim() || !tanggal_lahir) {
      return res.status(400).json({ message: 'Nama siswa dan tanggal lahir wajib diisi.' });
    }

    const [existing] = await pool.query('SELECT id FROM pendaftar WHERE user_id = ?', [req.user.id]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Anda sudah memiliki pendaftaran. Silakan cek status di dashboard.' });
    }

    const validJK = ['L', 'P'];
    const jk = validJK.includes(jenis_kelamin) ? jenis_kelamin : null;

    await pool.query(
      `INSERT INTO pendaftar (user_id, nama_siswa, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, nama_ayah, nama_ibu, no_hp, asal_sekolah, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu')`,
      [
        req.user.id,
        nama_siswa.trim(),
        tempat_lahir ? tempat_lahir.trim() : null,
        tanggal_lahir,
        jk,
        alamat ? alamat.trim() : null,
        nama_ayah ? nama_ayah.trim() : null,
        nama_ibu ? nama_ibu.trim() : null,
        no_hp ? no_hp.trim() : null,
        asal_sekolah ? asal_sekolah.trim() : null,
      ]
    );

    res.status(201).json({ message: 'Pendaftaran berhasil dikirim.' });
  } catch (err) {
    console.error('Create pendaftar error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.email AS email_ortu, u.nama AS nama_ortu
       FROM pendaftar p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data pendaftar tidak ditemukan.' });
    }

    const pendaftar = rows[0];

    if (req.user.role === 'ortu' && pendaftar.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke data ini.' });
    }

    const [dokumen] = await pool.query('SELECT id, jenis_dokumen, nama_file, uploaded_at FROM dokumen WHERE pendaftar_id = ?', [req.params.id]);

    res.json({ ...pendaftar, dokumen });
  } catch (err) {
    console.error('Get pendaftar detail error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.put('/:id/status', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    const validStatuses = ['menunggu', 'diverifikasi', 'ditolak'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid.' });
    }

    const [existing] = await pool.query('SELECT id FROM pendaftar WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Data pendaftar tidak ditemukan.' });
    }

    await pool.query(
      'UPDATE pendaftar SET status = ?, catatan_admin = ? WHERE id = ?',
      [status, catatan_admin ? catatan_admin.trim() : null, req.params.id]
    );

    res.json({ message: 'Status pendaftaran berhasil diperbarui.' });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.post('/:id/dokumen', authenticate, authorizeOrtu, upload.single('file'), handleMulterError, async (req, res) => {
  try {
    const pendaftarId = req.params.id;

    const [pendaftar] = await pool.query('SELECT id, user_id FROM pendaftar WHERE id = ?', [pendaftarId]);
    if (pendaftar.length === 0) {
      return res.status(404).json({ message: 'Data pendaftar tidak ditemukan.' });
    }

    if (pendaftar[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke data ini.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Pilih berkas terlebih dahulu.' });
    }

    const { jenis_dokumen } = req.body;
    const validJenis = ['akta_lahir', 'kartu_keluarga', 'foto', 'ijazah_skl', 'lainnya'];
    if (!validJenis.includes(jenis_dokumen)) {
      return res.status(400).json({ message: 'Jenis dokumen tidak valid.' });
    }

    await pool.query(
      'INSERT INTO dokumen (pendaftar_id, jenis_dokumen, nama_file, path_file) VALUES (?, ?, ?, ?)',
      [pendaftarId, jenis_dokumen, req.file.originalname, req.file.filename]
    );

    res.status(201).json({ message: 'Berkas berhasil diunggah.' });
  } catch (err) {
    console.error('Upload dokumen error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.get('/dokumen/:dokumenId/download', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT d.*, p.user_id FROM dokumen d JOIN pendaftar p ON d.pendaftar_id = p.id WHERE d.id = ?',
      [req.params.dokumenId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dokumen tidak ditemukan.' });
    }

    const dokumen = rows[0];

    if (req.user.role === 'ortu' && dokumen.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke dokumen ini.' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', dokumen.path_file);
    res.download(filePath, dokumen.nama_file);
  } catch (err) {
    console.error('Download dokumen error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;

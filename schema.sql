-- Skema Database SI-PPDB
-- Jalankan: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS db_ppdb;
USE db_ppdb;

-- Tabel akun pengguna (admin & orang tua/calon siswa)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'ortu') NOT NULL DEFAULT 'ortu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel data pendaftaran siswa baru
CREATE TABLE IF NOT EXISTS pendaftar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nama_siswa VARCHAR(150) NOT NULL,
  tempat_lahir VARCHAR(100),
  tanggal_lahir DATE,
  jenis_kelamin ENUM('L', 'P'),
  alamat TEXT,
  nama_ayah VARCHAR(150),
  nama_ibu VARCHAR(150),
  no_hp VARCHAR(20),
  asal_sekolah VARCHAR(150),
  status ENUM('menunggu', 'diverifikasi', 'ditolak') NOT NULL DEFAULT 'menunggu',
  catatan_admin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel berkas/dokumen yang diunggah
CREATE TABLE IF NOT EXISTS dokumen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pendaftar_id INT NOT NULL,
  jenis_dokumen ENUM('akta_lahir', 'kartu_keluarga', 'foto', 'ijazah_skl', 'lainnya') NOT NULL,
  nama_file VARCHAR(255) NOT NULL,
  path_file VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pendaftar_id) REFERENCES pendaftar(id) ON DELETE CASCADE
);

-- Tabel pengumuman
CREATE TABLE IF NOT EXISTS pengumuman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  isi TEXT NOT NULL,
  dibuat_oleh INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE SET NULL
);

-- Akun admin default (password: admin123, sudah di-hash bcrypt)
-- Ganti password ini setelah login pertama kali!
INSERT INTO users (nama, email, password, role)
VALUES ('Admin PPDB', 'admin@sekolah.sch.id', '$2b$10$tbLSzPHoouZzyIWgRdKEUODH1z.PwG11CTMq3aeHSSCvUAz/GsrbW', 'admin')
ON DUPLICATE KEY UPDATE email = email;

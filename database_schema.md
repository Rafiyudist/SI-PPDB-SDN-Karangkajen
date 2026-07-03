# Database Schema
## SI-PPDB — MySQL

Dokumen ini adalah blueprint basis data. AI developer WAJIB membuat struktur database persis seperti yang didefinisikan di sini — TIDAK BOLEH menambah, mengurangi, atau mengganti nama kolom/tabel tanpa persetujuan eksplisit.

---

## 1. Ketentuan Umum

- Database engine: **MySQL 8.x**
- Nama database: **`db_ppdb`**
- Semua tabel WAJIB menggunakan `id INT AUTO_INCREMENT PRIMARY KEY` sebagai primary key.
- Semua foreign key WAJIB menggunakan `ON DELETE CASCADE` kecuali dinyatakan lain.
- Password HARUS disimpan dalam bentuk hash bcrypt, TIDAK BOLEH plain text.
- Script pembuatan database yang valid dan siap eksekusi tersedia di file `schema.sql` pada folder yang sama.

---

## 2. Daftar Tabel

| Tabel | Fungsi |
|---|---|
| `users` | Akun admin dan orang tua/wali murid |
| `pendaftar` | Data formulir pendaftaran calon siswa baru |
| `dokumen` | Metadata berkas yang diunggah orang tua/wali |
| `pengumuman` | Pengumuman yang dipublikasikan admin |

---

## 3. Struktur Rinci

### 3.1 Tabel `users`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Identitas unik akun |
| nama | VARCHAR(150) | NOT NULL | Nama lengkap pengguna |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Email untuk login |
| password | VARCHAR(255) | NOT NULL | Password ter-hash (bcrypt) |
| role | ENUM('admin','ortu') | NOT NULL, DEFAULT 'ortu' | Peran pengguna |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Waktu akun dibuat |

### 3.2 Tabel `pendaftar`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Identitas unik pendaftaran |
| user_id | INT | NOT NULL, FK → users(id) | Relasi ke akun orang tua |
| nama_siswa | VARCHAR(150) | NOT NULL | Nama calon siswa |
| tempat_lahir | VARCHAR(100) | - | Tempat lahir |
| tanggal_lahir | DATE | - | Tanggal lahir |
| jenis_kelamin | ENUM('L','P') | - | Jenis kelamin |
| alamat | TEXT | - | Alamat domisili |
| nama_ayah | VARCHAR(150) | - | Nama ayah |
| nama_ibu | VARCHAR(150) | - | Nama ibu |
| no_hp | VARCHAR(20) | - | No. HP/WhatsApp aktif |
| asal_sekolah | VARCHAR(150) | - | Asal TK/PAUD |
| status | ENUM('menunggu','diverifikasi','ditolak') | NOT NULL, DEFAULT 'menunggu' | Status verifikasi |
| catatan_admin | TEXT | - | Catatan dari admin |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Waktu diperbarui |

Constraint bisnis WAJIB: satu `user_id` HANYA BOLEH muncul satu kali di tabel ini (divalidasi di level aplikasi backend, bukan unique constraint database, agar pesan error dapat dikustomisasi).

### 3.3 Tabel `dokumen`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Identitas unik dokumen |
| pendaftar_id | INT | NOT NULL, FK → pendaftar(id) | Relasi ke pendaftaran |
| jenis_dokumen | ENUM('akta_lahir','kartu_keluarga','foto','ijazah_skl','lainnya') | NOT NULL | Kategori berkas |
| nama_file | VARCHAR(255) | NOT NULL | Nama asli file |
| path_file | VARCHAR(500) | NOT NULL | Nama file tersimpan di server |
| uploaded_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Waktu diunggah |

### 3.4 Tabel `pengumuman`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Identitas unik pengumuman |
| judul | VARCHAR(200) | NOT NULL | Judul pengumuman |
| isi | TEXT | NOT NULL | Isi pengumuman |
| dibuat_oleh | INT | FK → users(id), ON DELETE SET NULL | Admin pembuat |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Waktu dipublikasikan |

---

## 4. Relasi Antar Tabel

```
users (1) ──< (N) pendaftar (1) ──< (N) dokumen
users (1) ──< (N) pengumuman
```

| Tabel Induk | Kardinalitas | Tabel Anak | Keterangan |
|---|---|---|---|
| users | 1 : N | pendaftar | Satu akun ortu idealnya 1 pendaftaran (dibatasi di aplikasi) |
| pendaftar | 1 : N | dokumen | Satu pendaftaran dapat punya banyak berkas |
| users | 1 : N | pengumuman | Satu admin dapat membuat banyak pengumuman |

---

## 5. Seed Data Wajib

Database WAJIB memiliki satu akun admin default saat pertama kali dibuat:

- Email: `admin@sekolah.sch.id`
- Password (sebelum di-hash): `admin123`
- Role: `admin`

Akun ini HARUS diganti password-nya sebelum sistem digunakan secara nyata (production).

---

## 6. Cara Menjalankan

```bash
mysql -u root -p < schema.sql
```

Perintah ini akan membuat database `db_ppdb`, seluruh tabel di atas, beserta satu akun admin default.

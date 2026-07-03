# SI-PPDB - Sistem Informasi Penerimaan Peserta Didik Baru

Aplikasi full-stack untuk pendaftaran siswa baru secara online di SDN Karangkajen — menggantikan alur manual (Google Form + Excel) dengan satu platform terintegrasi untuk pendaftaran, verifikasi berkas, dan pengumuman.

## Tech Stack

- **Backend:** Express.js, MySQL, JWT Authentication, bcrypt, Multer (upload berkas)
- **Frontend:** Next.js (Pages Router), React 18
- **Database:** MySQL 8.x (lokal atau hosting — tidak terikat cloud provider tertentu)

## Prerequisites

- Node.js ≥ 18
- npm
- MySQL Server sudah berjalan (lokal via XAMPP/Laragon, atau instance MySQL lain)

## Database Connection

Buat file `.env` di folder `backend/` berdasarkan `backend/.env.example`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_ppdb
JWT_SECRET=ganti_dengan_string_rahasia_yang_panjang_dan_acak
```

- Struktur lengkap database ada di `sot-ppdb/database_schema.md`.
- Skema tabel dibuat lewat `backend/sql/schema.sql` — jalankan sekali di awal setup.
- Berkas yang diunggah orang tua disimpan di filesystem server (`backend/uploads/`), metadata-nya di tabel `dokumen`.

## Project Structure

```
ppdb-project/
├── backend/             # Backend (Express.js)
│   ├── config/          # Koneksi database
│   ├── middleware/      # Auth (JWT) & upload (Multer)
│   ├── routes/          # API routes: auth, pendaftar, pengumuman
│   ├── sql/              # schema.sql
│   ├── uploads/          # File berkas yang diunggah
│   └── server.js          # Entry point
├── frontend/              # Frontend (Next.js)
│   ├── components/        # Navbar, dsb
│   ├── lib/                # api.js (fetch wrapper), auth.js (context)
│   ├── pages/               # Routing: login, register, dashboard/*, pengumuman
│   └── styles/               # globals.css
└── sot-ppdb/                  # Source of Truth (blueprint project)
    ├── srs.md
    ├── information_architecture.md
    ├── design_system.md
    ├── database_schema.md
    └── user_flows/
```

## Setup

```bash
# 1. Setup database
mysql -u root -p < backend/sql/schema.sql

# 2. Install dependencies backend
cd backend
npm install
cp .env.example .env    # lalu isi kredensial MySQL & JWT_SECRET

# 3. Jalankan backend
npm run dev              # aktif di http://localhost:5000

# 4. Install dependencies frontend (di terminal baru)
cd frontend
npm install
cp .env.local.example .env.local

# 5. Jalankan frontend
npm run dev              # aktif di http://localhost:3000
```

> **Catatan:** `schema.sql` hanya perlu dijalankan sekali di awal, atau saat struktur tabel berubah. Menjalankan ulang tidak akan menghapus data existing karena menggunakan `CREATE TABLE IF NOT EXISTS`.

## Seed User (Admin Default)

| Email | Password | Role |
|---|---|---|
| admin@sekolah.sch.id | admin123 | admin |

> Akun orang tua/wali TIDAK di-seed — dibuat sendiri lewat halaman `/register`. Segera ganti password admin default ini sebelum sistem dipakai secara nyata.

## Hak Akses per Role

| Role | Formulir Pendaftaran | Upload Berkas | Verifikasi Berkas | Kelola Pengumuman |
|---|---|---|---|---|
| **admin** | - | - | Ya, semua pendaftar | Ya (buat & hapus) |
| **ortu** | Ya (hanya untuk data miliknya) | Ya (hanya untuk data miliknya) | - | Lihat saja |

> Catatan: satu akun `ortu` hanya boleh memiliki satu data pendaftaran. Endpoint upload dan detail pendaftaran divalidasi berdasarkan kepemilikan (`user_id`), bukan sekadar role.

## Pages & Features

| Route | Akses | Fitur |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Login (satu form untuk admin & ortu) |
| `/register` | Public | Registrasi akun orang tua/wali |
| `/dashboard` | Semua role (login) | Router otomatis sesuai role |
| `/dashboard/ortu` | ortu | Form pendaftaran / status + upload berkas |
| `/dashboard/admin` | admin | Tab Data Pendaftar (verifikasi) + Tab Kelola Pengumuman |
| `/pengumuman` | Semua role (login) | Daftar pengumuman terbaru |

## Source of Truth

- `sot-ppdb/srs.md` — Scope, aktor, tech stack, business rules
- `sot-ppdb/information_architecture.md` — Route map & navigasi
- `sot-ppdb/design_system.md` — Warna, tipografi, komponen UI
- `sot-ppdb/database_schema.md` — Struktur database lengkap
- `sot-ppdb/user_flows/` — 7 use case flow (UC-001 s.d. UC-007)

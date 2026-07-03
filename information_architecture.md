# Information Architecture (IA)
## SI-PPDB

---

## 1. Global Layout

Sistem HARUS menggunakan struktur layout berikut secara konsisten di semua halaman:

- **Navbar (atas, full-width):** Berisi nama brand di kiri ("SI-PPDB Sekolah"), dan di kanan berupa link navigasi yang berubah tergantung status login:
  - Belum login: link "Pengumuman", "Masuk", "Daftar".
  - Sudah login: link "Pengumuman", "Dashboard", "Keluar".
- **Konten Utama:** Area tunggal di bawah navbar, lebar maksimum ter-center (`max-width: 960px`), TIDAK menggunakan sidebar.
- **Tidak ada footer wajib** pada fase ini.

Layout HARUS responsif dan tetap dapat digunakan pada lebar layar mobile (minimum 360px).

---

## 2. Route Map

| Route | Deskripsi | Akses |
|---|---|---|
| `/` | Landing page — penjelasan singkat sistem, tombol ke Daftar/Masuk | Public |
| `/login` | Form login (satu form untuk admin & orang tua) | Public (redirect ke `/dashboard` jika sudah login) |
| `/register` | Form registrasi akun orang tua/wali | Public |
| `/pengumuman` | Daftar seluruh pengumuman | Authenticated (admin & ortu) |
| `/dashboard` | Router otomatis — mengarahkan ke `/dashboard/ortu` atau `/dashboard/admin` sesuai `role` | Authenticated |
| `/dashboard/ortu` | Formulir pendaftaran (jika belum ada data) ATAU status pendaftaran + upload berkas (jika sudah ada data) | Authenticated, role = `ortu` |
| `/dashboard/admin` | Tab "Data Pendaftar" (list + verifikasi) dan tab "Kelola Pengumuman" | Authenticated, role = `admin` |

Aturan navigasi WAJIB:
- Jika pengguna belum login mencoba mengakses route yang butuh autentikasi, sistem HARUS redirect ke `/login`.
- Jika pengguna dengan role `ortu` mencoba mengakses `/dashboard/admin` (atau sebaliknya), sistem HARUS redirect ke `/dashboard` (yang kemudian mengarahkan ulang sesuai role asli).
- Setelah login sukses, sistem HARUS redirect ke `/dashboard`.
- Setelah logout, sistem HARUS redirect ke `/login`.

---

## 3. Navigasi (Hierarki Menu)

```
Navbar
├── Brand → "/"
├── Pengumuman → "/pengumuman"
├── [Jika belum login]
│   ├── Masuk → "/login"
│   └── Daftar → "/register"
└── [Jika sudah login]
    ├── Dashboard → "/dashboard"
    └── Keluar → logout() lalu redirect "/login"
```

Dashboard Admin memiliki sub-navigasi berupa tab (bukan route terpisah):

```
/dashboard/admin
├── Tab: Data Pendaftar
│   ├── Filter status (dropdown: Semua / Menunggu / Diverifikasi / Ditolak)
│   ├── Tabel daftar pendaftar
│   └── Panel detail (muncul saat "Periksa Berkas" diklik)
└── Tab: Kelola Pengumuman
    ├── Form buat pengumuman baru
    └── List pengumuman (dengan tombol hapus)
```

Dashboard Orang Tua memiliki dua kondisi tampilan pada satu route yang sama (bukan tab, bukan route terpisah):

```
/dashboard/ortu
├── [Jika belum ada data pendaftar] → Tampilkan Formulir Pendaftaran
└── [Jika sudah ada data pendaftar] → Tampilkan:
    ├── Kartu Status Pendaftaran (nama siswa, badge status, catatan admin)
    └── Panel Upload Berkas (form upload + tabel berkas yang sudah diunggah)
```

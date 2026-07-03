# UC-002: Login Pengguna

## Aktor
Admin PPDB, Orang Tua/Wali Murid (kedua role menggunakan form yang sama).

## Pre-condition
- Pengguna sudah memiliki akun terdaftar (dari UC-001 untuk orang tua, atau seed database untuk admin).
- Pengguna berada di halaman `/login`.

## Main Flow
1. Pengguna mengisi Email dan Password.
2. Pengguna menekan tombol "Masuk".
3. Sistem mengirim request ke `POST /api/auth/login`.
4. Backend mencari akun berdasarkan email.
5. Backend membandingkan password menggunakan `bcrypt.compare`.
6. Jika cocok, backend membuat JWT berisi `{ id, email, role, nama }` dengan masa berlaku 8 jam.
7. Backend mengembalikan token dan data user.
8. Frontend menyimpan token dan data user ke `localStorage`.
9. Sistem redirect ke `/dashboard`.
10. `/dashboard` membaca `role` dari state auth dan redirect otomatis: `admin` → `/dashboard/admin`, `ortu` → `/dashboard/ortu`.

## Alternative / Exception Flow
- **Email tidak ditemukan / password salah:** Backend mengembalikan status 401 dengan pesan generik "Email atau password salah." (TIDAK BOLEH membedakan pesan antara "email tidak ada" dan "password salah", untuk alasan keamanan).
- **Field kosong:** Backend mengembalikan status 400.
- **Token kedaluwarsa saat pengguna sudah login (di kunjungan berikutnya):** Endpoint terproteksi mengembalikan status 403, frontend HARUS redirect ke `/login`.

## Post-condition
- Token JWT tersimpan di `localStorage` browser.
- Pengguna diarahkan ke dashboard sesuai role.

# UC-001: Registrasi Akun Orang Tua

## Aktor
Orang Tua / Wali Murid (calon pengguna baru, belum memiliki akun).

## Pre-condition
- Pengguna belum memiliki akun terdaftar dengan email yang sama.
- Pengguna berada di halaman `/register`.

## Main Flow
1. Pengguna membuka halaman `/register`.
2. Pengguna mengisi field: Nama Lengkap, Email, Password (minimal 6 karakter).
3. Pengguna menekan tombol "Daftar".
4. Sistem mengirim request ke `POST /api/auth/register`.
5. Backend memvalidasi bahwa email belum terdaftar.
6. Backend melakukan hashing password menggunakan bcrypt.
7. Backend menyimpan akun baru ke tabel `users` dengan `role = 'ortu'`.
8. Sistem menampilkan alert sukses: "Registrasi berhasil! Mengalihkan ke halaman login...".
9. Sistem otomatis redirect ke `/login` setelah 1.5 detik.

## Alternative / Exception Flow
- **Email sudah terdaftar:** Backend mengembalikan status 409, frontend menampilkan alert error: "Email sudah terdaftar. Silakan login."
- **Field kosong:** Validasi HTML5 `required` mencegah submit di frontend; backend tetap memvalidasi ulang dan mengembalikan status 400 jika field kosong/tidak lengkap.
- **Password kurang dari 6 karakter:** Backend mengembalikan status 400 dengan pesan "Password minimal 6 karakter."

## Post-condition
- Satu baris baru tersimpan di tabel `users` dengan `role = 'ortu'`.
- Pengguna belum dalam kondisi login (harus login manual di langkah berikutnya, UC-002).

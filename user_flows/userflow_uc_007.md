# UC-007: Melihat Pengumuman & Status Pendaftaran

## Aktor
Orang Tua / Wali Murid.

## Pre-condition
- Pengguna sudah login dengan role `ortu`.

## Main Flow — Melihat Status Pendaftaran
1. Pengguna membuka `/dashboard/ortu`.
2. Sistem memanggil `GET /api/pendaftar` untuk mengecek apakah sudah ada data pendaftaran milik pengguna.
3. Jika ada, sistem memanggil `GET /api/pendaftar/:id` untuk detail lengkap.
4. Sistem menampilkan Kartu Status berisi: Nama Siswa, Badge Status (`menunggu`/`diverifikasi`/`ditolak` dengan warna sesuai Design System), dan Catatan Admin (jika ada, ditampilkan dalam kotak alert).

## Main Flow — Melihat Pengumuman
1. Pengguna menekan link "Pengumuman" di navbar.
2. Sistem memanggil `GET /api/pengumuman`.
3. Sistem menampilkan seluruh pengumuman dalam bentuk kartu, diurutkan dari yang terbaru, masing-masing menampilkan Judul, Isi, dan tanggal publikasi.

## Alternative / Exception Flow
- **Belum ada pengumuman:** Sistem menampilkan pesan: "Belum ada pengumuman." di dalam Card.
- **Pengguna belum login mencoba akses `/pengumuman`:** Sistem menampilkan pesan error: "Silakan masuk terlebih dahulu untuk melihat pengumuman." (TIDAK BOLEH menampilkan data pengumuman ke pengguna yang belum login).
- **Status pendaftaran adalah `ditolak`:** Kartu status HARUS tetap menampilkan Catatan Admin secara jelas agar orang tua memahami alasan penolakan.

## Post-condition
- Tidak ada perubahan data — use case ini bersifat read-only.

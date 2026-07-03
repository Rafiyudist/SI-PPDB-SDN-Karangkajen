# UC-005: Memverifikasi Berkas Pendaftar

## Aktor
Admin PPDB.

## Pre-condition
- Admin sudah login dengan role `admin`.
- Minimal ada satu data pendaftar di sistem.

## Main Flow
1. Admin membuka `/dashboard/admin`, tab "Data Pendaftar" aktif secara default.
2. Sistem memuat seluruh data pendaftar via `GET /api/pendaftar`, ditampilkan dalam tabel (Nama Siswa, Email Ortu, Status).
3. Admin dapat memfilter tabel berdasarkan status menggunakan dropdown (Semua/Menunggu/Diverifikasi/Ditolak), yang memicu `GET /api/pendaftar?status=<value>`.
4. Admin menekan tombol "Periksa Berkas" pada salah satu baris.
5. Sistem mengambil detail lengkap via `GET /api/pendaftar/:id`, termasuk daftar dokumen terkait.
6. Panel detail muncul menampilkan biodata siswa dan tabel berkas.
7. Admin menekan link "Lihat Berkas" pada salah satu dokumen untuk membuka file di tab baru (`GET /api/pendaftar/dokumen/:dokumenId/download`).
8. Admin, setelah memeriksa seluruh berkas, dapat mengisi Catatan (opsional) dan menekan salah satu tombol: "Verifikasi & Terima" atau "Tolak".
9. Sistem mengirim `PUT /api/pendaftar/:id/status` dengan `{ status, catatan_admin }`.
10. Backend memperbarui kolom `status` dan `catatan_admin` pada tabel `pendaftar`.
11. Sistem menampilkan alert sukses dan menutup panel detail, tabel daftar pendaftar dimuat ulang otomatis.

## Alternative / Exception Flow
- **Belum ada berkas diunggah:** Panel menampilkan teks: "Belum ada berkas." — admin tetap dapat mengubah status jika diperlukan (misal menolak karena berkas tidak lengkap).
- **Status tidak valid dikirim ke backend:** Backend menolak dengan status 400: "Status tidak valid."
- **Admin mencoba mengakses endpoint ini tanpa role admin:** Backend mengembalikan status 403.

## Post-condition
- Kolom `status` dan `catatan_admin` pada baris `pendaftar` terkait diperbarui.
- Orang tua/wali pemilik data akan melihat status dan catatan terbaru pada kunjungan berikutnya ke `/dashboard/ortu` (lihat UC-007).

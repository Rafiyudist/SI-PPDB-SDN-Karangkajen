# UC-006: Mengelola Pengumuman

## Aktor
Admin PPDB.

## Pre-condition
- Admin sudah login dengan role `admin`.

## Main Flow
1. Admin membuka `/dashboard/admin`, memilih tab "Kelola Pengumuman".
2. Sistem memuat daftar pengumuman via `GET /api/pengumuman`.
3. Admin mengisi form: Judul, Isi Pengumuman.
4. Admin menekan tombol "Publikasikan".
5. Sistem mengirim `POST /api/pengumuman` dengan `{ judul, isi }`.
6. Backend menyimpan data baru ke tabel `pengumuman`, `dibuat_oleh` diisi otomatis dari `user_id` token.
7. Sistem menampilkan alert sukses: "Pengumuman berhasil dipublikasikan." dan me-reset form.
8. Daftar pengumuman dimuat ulang, menampilkan entri terbaru di posisi paling atas.
9. Untuk menghapus, admin menekan tombol "Hapus" pada salah satu pengumuman.
10. Sistem menampilkan dialog konfirmasi browser (`confirm()`).
11. Jika dikonfirmasi, sistem mengirim `DELETE /api/pengumuman/:id`, lalu memuat ulang daftar.

## Alternative / Exception Flow
- **Judul atau isi kosong:** Backend mengembalikan status 400: "Judul dan isi pengumuman wajib diisi."
- **Admin membatalkan dialog konfirmasi hapus:** Tidak ada request dikirim, data tidak berubah.
- **Bukan role admin mencoba mengakses endpoint create/delete:** Backend mengembalikan status 403.

## Post-condition
- Tabel `pengumuman` bertambah/berkurang satu baris sesuai aksi.
- Pengumuman baru langsung terlihat oleh seluruh pengguna yang login (lihat UC-007).

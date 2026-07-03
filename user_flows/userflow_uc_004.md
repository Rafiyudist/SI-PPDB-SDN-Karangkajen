# UC-004: Mengunggah Berkas Persyaratan

## Aktor
Orang Tua / Wali Murid.

## Pre-condition
- Pengguna sudah login dengan role `ortu`.
- Pengguna sudah memiliki data pendaftaran (hasil dari UC-003).

## Main Flow
1. Pada halaman `/dashboard/ortu`, pengguna melihat Panel Upload Berkas.
2. Pengguna memilih Jenis Dokumen dari dropdown: Akta Kelahiran / Kartu Keluarga / Pas Foto / Ijazah-SKL / Lainnya.
3. Pengguna memilih file dari perangkat (format harus PDF/JPG/PNG, maksimal 5MB).
4. Pengguna menekan tombol "Unggah Berkas".
5. Sistem mengirim `POST /api/pendaftar/:id/dokumen` sebagai `multipart/form-data` berisi `jenis_dokumen` dan `file`.
6. Backend memvalidasi bahwa `pendaftar_id` pada URL adalah milik `user_id` yang sedang login.
7. Middleware Multer memvalidasi ekstensi file dan ukuran maksimal.
8. Backend menyimpan file fisik ke folder `uploads/` dengan format nama `<pendaftarId>-<jenisDokumen>-<timestamp>.ext`.
9. Backend menyimpan metadata ke tabel `dokumen`.
10. Sistem menampilkan alert sukses: "Berkas berhasil diunggah."
11. Sistem memuat ulang data sehingga tabel "Berkas Terunggah" menampilkan file yang baru saja diunggah.

## Alternative / Exception Flow
- **Tidak ada file dipilih:** Frontend menampilkan alert error: "Pilih berkas terlebih dahulu." sebelum request dikirim.
- **Format file tidak diizinkan:** Backend (Multer `fileFilter`) menolak dengan error: "Tipe file tidak diizinkan. Gunakan PDF, JPG, atau PNG."
- **Ukuran file melebihi 5MB:** Multer menolak upload secara otomatis (limit `fileSize`).
- **Pengguna mencoba upload ke `pendaftar_id` milik orang lain:** Backend mengembalikan status 403: "Anda tidak memiliki akses ke data ini."

## Post-condition
- File fisik tersimpan di `backend/uploads/`.
- Satu baris baru tersimpan di tabel `dokumen`, terhubung ke `pendaftar_id` terkait.
- Data ini SEGERA dapat dilihat oleh admin tanpa proses approval tambahan (lihat UC-005) — begitu tersimpan di database, dianggap "masuk" ke sisi admin.

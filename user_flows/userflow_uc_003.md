# UC-003: Mengisi Formulir Pendaftaran Siswa Baru

## Aktor
Orang Tua / Wali Murid.

## Pre-condition
- Pengguna sudah login dengan role `ortu`.
- Pengguna belum memiliki data pendaftaran (`pendaftar`) sebelumnya.

## Main Flow
1. Pengguna membuka `/dashboard/ortu`.
2. Karena belum ada data pendaftaran, sistem menampilkan Formulir Pendaftaran.
3. Pengguna mengisi field: Nama Siswa, Tempat Lahir, Tanggal Lahir (wajib), Jenis Kelamin, Alamat, Nama Ayah, Nama Ibu, No. HP, Asal Sekolah.
4. Pengguna menekan tombol "Kirim Pendaftaran".
5. Sistem mengirim request ke `POST /api/pendaftar` dengan header Authorization berisi JWT.
6. Backend memvalidasi bahwa `nama_siswa` dan `tanggal_lahir` terisi.
7. Backend memvalidasi bahwa `user_id` dari token belum memiliki data di tabel `pendaftar`.
8. Backend menyimpan data baru dengan `status = 'menunggu'`.
9. Sistem menampilkan alert sukses: "Pendaftaran berhasil dikirim."
10. Sistem memuat ulang data (`loadData()`), sehingga tampilan berubah menjadi Kartu Status Pendaftaran + Panel Upload Berkas (lihat UC-004).

## Alternative / Exception Flow
- **Nama siswa atau tanggal lahir kosong:** Backend mengembalikan status 400: "Nama siswa dan tanggal lahir wajib diisi."
- **Akun sudah memiliki pendaftaran:** Backend mengembalikan status 409: "Anda sudah memiliki pendaftaran. Silakan cek status di dashboard." Frontend TIDAK BOLEH menampilkan form ini lagi setelah data ada — halaman otomatis menampilkan status.

## Post-condition
- Satu baris baru tersimpan di tabel `pendaftar`, terhubung ke `user_id` pengguna, dengan `status = 'menunggu'`.

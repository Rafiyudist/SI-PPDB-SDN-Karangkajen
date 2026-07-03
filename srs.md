# Software Requirements Specification (SRS)
## Sistem Informasi Penerimaan Peserta Didik Baru (SI-PPDB)

---

## 1. Tujuan Sistem

Sistem ini dibangun untuk menggantikan proses Penerimaan Peserta Didik Baru (PPDB) yang saat ini dilakukan secara semi-manual (Google Form, penyimpanan data di Excel/Word, dan tidak ada basis data terpusat). Sistem HARUS menyediakan satu platform terintegrasi di mana orang tua/wali murid dapat mendaftarkan calon siswa secara online dan mengunggah berkas persyaratan, sementara admin sekolah dapat memverifikasi berkas tersebut dan mengelola pengumuman, semuanya tersimpan dalam satu basis data terpusat.

Sistem WAJIB menghilangkan ketergantungan pada Google Form dan dokumen perkantoran manual, serta WAJIB memberikan status pendaftaran yang transparan dan dapat dipantau real-time oleh orang tua.

---

## 2. Aktor Pengguna

| Aktor | Deskripsi |
|---|---|
| **Admin PPDB** | Staf sekolah yang mengelola proses pendaftaran, memeriksa dan memverifikasi berkas, serta mempublikasikan pengumuman. |
| **Orang Tua / Wali Murid** | Pengguna yang mendaftarkan calon siswa baru, mengunggah berkas, dan memantau status pendaftaran. |

Sistem HANYA BOLEH memiliki dua role ini. Tidak ada role tambahan (misal super-admin, guru, siswa) di luar scope ini.

---

## 3. Tech Stack

Tech stack berikut WAJIB digunakan dan TIDAK BOLEH diganti tanpa persetujuan eksplisit:

- **Frontend:** Next.js (Pages Router), React
- **Backend:** Express.js (Node.js)
- **Database:** MySQL 8.x
- **Autentikasi:** JSON Web Token (JWT), password di-hash dengan bcrypt
- **Upload File:** Multer, disimpan di filesystem server (folder `uploads/`)

Database HARUS bernama `db_ppdb`. Struktur lengkap tabel mengacu pada `database_schema.md`.

---

## 4. In-Scope Features

Fitur berikut WAJIB dibuat:

1. Registrasi akun untuk orang tua/wali murid (role otomatis `ortu`).
2. Login untuk admin dan orang tua menggunakan satu form login yang sama (dibedakan berdasarkan `role` di database).
3. Formulir pendaftaran calon siswa baru (diisi oleh orang tua, satu akun HANYA BOLEH memiliki satu data pendaftaran).
4. Upload berkas persyaratan oleh orang tua: akta kelahiran, kartu keluarga, pas foto, ijazah/SKL, lainnya. Format file HANYA BOLEH PDF, JPG, atau PNG, dengan ukuran maksimal 5MB per file.
5. Admin dapat melihat daftar seluruh pendaftar, memfilter berdasarkan status.
6. Admin dapat membuka detail satu pendaftar, melihat/mengunduh setiap berkas yang diunggah, dan mengubah status pendaftaran menjadi `diverifikasi` atau `ditolak`, disertai catatan opsional.
7. Orang tua dapat melihat status pendaftaran (`menunggu`, `diverifikasi`, `ditolak`) dan catatan dari admin secara real-time saat halaman dibuka/di-refresh.
8. Admin dapat membuat, melihat, dan menghapus pengumuman.
9. Semua pengguna yang sudah login (admin maupun orang tua) dapat melihat daftar pengumuman.

---

## 5. Out-of-Scope Features

Fitur berikut TIDAK BOLEH dibuat pada fase ini:

- Tidak ada fitur lupa password / reset password via email.
- Tidak ada integrasi payment gateway atau modul pembayaran biaya PPDB.
- Tidak ada notifikasi push/email/WhatsApp otomatis.
- Tidak ada fitur multi-sekolah/multi-tenant — sistem HANYA untuk satu instansi sekolah.
- Tidak ada modul akademik pasca-penerimaan (rapor, jadwal kelas, dsb).
- Tidak ada dashboard analitik/statistik grafis pada fase ini.
- Tidak ada fitur edit data pendaftaran oleh orang tua setelah data terkirim (jika perlu revisi, dilakukan melalui catatan admin dan proses ulang di fase berikutnya).

---

## 6. Business Rules

Aturan logika berikut WAJIB diterapkan secara ketat di backend (bukan hanya validasi frontend):

1. Satu akun dengan role `ortu` HANYA BOLEH memiliki satu data pendaftaran (`pendaftar`). Percobaan membuat pendaftaran kedua HARUS ditolak dengan pesan error yang jelas.
2. Registrasi akun baru HARUS selalu diberi role `ortu`. Role `admin` HANYA BOLEH dibuat secara manual langsung di database (melalui seed), tidak tersedia lewat form registrasi publik.
3. Status pendaftaran baru SELALU dimulai dari `menunggu` dan HANYA BOLEH diubah oleh akun dengan role `admin`.
4. Endpoint upload berkas HANYA BOLEH diakses oleh pemilik data pendaftaran (`user_id` yang cocok dengan token JWT), bukan oleh orang tua lain.
5. Endpoint verifikasi status dan pembuatan/penghapusan pengumuman HANYA BOLEH diakses oleh role `admin`.
6. Password WAJIB di-hash menggunakan bcrypt sebelum disimpan; sistem TIDAK BOLEH menyimpan password dalam bentuk plain text dalam kondisi apa pun.
7. File yang diunggah HARUS divalidasi ekstensi (`.pdf`, `.jpg`, `.jpeg`, `.png`) dan ukuran (maksimal 5MB) di sisi backend, bukan hanya di frontend.
8. Setiap request ke endpoint yang butuh autentikasi WAJIB menyertakan token JWT valid pada header `Authorization: Bearer <token>`; jika tidak, sistem HARUS mengembalikan status 401.

---

## 7. Kondisi Sukses Sistem

Sistem dianggap selesai dan sesuai SoT jika:

- Orang tua dapat mendaftar, login, mengisi formulir, mengunggah seluruh jenis berkas, dan melihat status yang berubah sesuai aksi admin.
- Admin dapat login, melihat seluruh data pendaftar beserta berkasnya, mengubah status, dan mengelola pengumuman.
- Tidak ada endpoint yang dapat diakses tanpa autentikasi/role yang sesuai (lihat Business Rules).

# Index — Peta Alur Pengguna (User Flows)
## SI-PPDB

Daftar seluruh use case yang WAJIB diimplementasikan. Setiap use case memiliki file detail terpisah dengan format `userflow_uc_XXX.md`.

| Kode | Nama Use Case | Aktor | File Detail |
|---|---|---|---|
| UC-001 | Registrasi Akun Orang Tua | Orang Tua/Wali | `userflow_uc_001.md` |
| UC-002 | Login Pengguna | Admin, Orang Tua/Wali | `userflow_uc_002.md` |
| UC-003 | Mengisi Formulir Pendaftaran Siswa Baru | Orang Tua/Wali | `userflow_uc_003.md` |
| UC-004 | Mengunggah Berkas Persyaratan | Orang Tua/Wali | `userflow_uc_004.md` |
| UC-005 | Memverifikasi Berkas Pendaftar | Admin PPDB | `userflow_uc_005.md` |
| UC-006 | Mengelola Pengumuman | Admin PPDB | `userflow_uc_006.md` |
| UC-007 | Melihat Pengumuman & Status Pendaftaran | Orang Tua/Wali | `userflow_uc_007.md` |

Urutan implementasi yang disarankan (dari fondasi ke fitur turunan): UC-001 → UC-002 → UC-003 → UC-004 → UC-005 → UC-006 → UC-007.

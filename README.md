# Source of Truth (SoT) — SI-PPDB

Paket dokumen blueprint ini disusun mengikuti kaidah Tutorial Praktikum "Cara Menyusun Dokumen Source of Truth (SoT)": deterministik, berbasis teks/markdown, dan fokus pada "apa" serta "bagaimana" — bukan potongan kode spesifik.

## Cara Menggunakan

Gunakan paket ini sebagai prompt/context untuk AI agentic developer (misal Claude Code) dengan urutan baca:

1. **`srs.md`** — batasan dan aturan bisnis sistem. Baca ini pertama kali agar AI memahami scope yang tidak boleh dilanggar.
2. **`information_architecture.md`** — peta rute dan navigasi.
3. **`design_system.md`** — aturan visual agar UI konsisten.
4. **`database_schema.md`** + **`schema.sql`** — struktur database yang wajib dibuat persis seperti ini. `schema.sql` bisa langsung dieksekusi ke MySQL.
5. **`user_flows/index.md`** lalu seluruh file `user_flows/userflow_uc_00X.md`** — detail interaksi tiap fitur, dibaca sesuai urutan implementasi yang disarankan di index.

## Struktur Folder

```
sot-ppdb/
├── README.md
├── srs.md
├── information_architecture.md
├── design_system.md
├── database_schema.md
├── schema.sql
└── user_flows/
    ├── index.md
    ├── userflow_uc_001.md   (Registrasi Akun)
    ├── userflow_uc_002.md   (Login)
    ├── userflow_uc_003.md   (Formulir Pendaftaran)
    ├── userflow_uc_004.md   (Upload Berkas)
    ├── userflow_uc_005.md   (Verifikasi Admin)
    ├── userflow_uc_006.md   (Kelola Pengumuman)
    └── userflow_uc_007.md   (Lihat Pengumuman & Status)
```

## Catatan

Dokumen ini disusun berdasarkan implementasi yang sudah pernah dibuat sebelumnya (Next.js + Express.js + MySQL). Jika di-generate ulang dari nol oleh AI agent menggunakan SoT ini saja, hasil akhirnya seharusnya setara secara fungsional dengan project yang sudah ada.
"# SI-PPDB-SDN-Karangajen" 

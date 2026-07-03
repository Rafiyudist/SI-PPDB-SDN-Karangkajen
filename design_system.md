# Design System
## SI-PPDB

Dokumen ini mendefinisikan aturan visual yang WAJIB diikuti secara konsisten oleh AI developer saat men-generate UI. TIDAK BOLEH ada komponen yang menyimpang dari palet dan gaya berikut tanpa alasan fungsional yang jelas.

---

## 1. Color Palette

| Nama | Kode HEX | Penggunaan |
|---|---|---|
| Primary | `#10367D` | Navbar, tombol utama, heading aksen, border aktif |
| Primary Dark (hover) | `#0C2B63` | State hover untuk elemen Primary |
| Secondary | `#6C757D` | Tombol sekunder/batal |
| Success | `#2E7D32` | Tombol "Verifikasi & Terima", badge status `diverifikasi` |
| Warning | `#856404` (teks) / `#FFF3CD` (background) | Badge status `menunggu` |
| Danger | `#C62828` | Tombol "Tolak"/"Hapus", pesan error, badge status `ditolak` |
| Background halaman | `#F4F6F9` | Latar belakang seluruh halaman |
| Card/Container | `#FFFFFF` | Latar belakang kartu konten |
| Teks utama | `#1A1A1A` | Teks isi umum |
| Teks sekunder/muted | `#666666` / `#888888` | Keterangan, timestamp, placeholder |

Kombinasi warna status (badge) HARUS konsisten:
- `menunggu` → background `#FFF3CD`, teks `#856404`
- `diverifikasi` → background `#D4EDDA`, teks `#155724`
- `ditolak` → background `#F8D7DA`, teks `#721C24`

---

## 2. Tipografi

- **Font family:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` (system font stack, TIDAK memuat font eksternal untuk menjaga performa).
- **Ukuran teks:**
  - H1 (judul halaman utama): 28–32px, bold
  - H2 (judul kartu/section): 20–22px, bold
  - H3 (sub-judul dalam kartu): 16–18px, bold
  - Body/paragraf: 14px, regular
  - Label form & keterangan kecil: 12–13px

---

## 3. Komponen UI

### Button
- Sudut membulat (`border-radius: 6px`), TIDAK BOLEH sudut tajam (0px) atau full-rounded (pill).
- Padding: `10px 18px` untuk tombol utama, `6px–8px 12px–16px` untuk tombol kecil di dalam tabel.
- Warna dasar Primary (`#10367D`), teks putih.
- State hover: warna berubah ke Primary Dark (`#0C2B63`), TIDAK ada animasi transform/scale.
- State disabled: background abu-abu (`#AAAAAA`), cursor `not-allowed`.
- Varian: `.btn` (primary), `.btn-secondary`, `.btn-success`, `.btn-danger`.

### Input Form
- Border solid 1px warna `#CCCCCC`, border-radius `6px`.
- Padding `10px`, ukuran font `14px`.
- Label WAJIB ditampilkan di atas input (bukan placeholder-only), bold, ukuran 14px, margin-bottom `6px`.
- Lebar input SELALU 100% dari kontainer form-group.

### Card
- Background putih, border-radius `10px`, padding `24px`.
- Shadow tipis: `0 1px 4px rgba(0,0,0,0.08)`. TIDAK BOLEH menggunakan shadow tebal/dramatis.
- Margin bawah antar card: `16px`.

### Table
- Border-collapse penuh, TIDAK ada border luar tebal.
- Setiap baris dipisahkan garis bawah tipis `1px solid #EEEEEE`.
- Header tabel (`th`) rata kiri, padding `10px`, font-weight bold.
- TIDAK menggunakan zebra-striping kecuali dinyatakan lain.

### Tabs (khusus Dashboard Admin)
- Tombol tab berdampingan horizontal, border `1px solid #CCCCCC`, border-radius `6px`.
- Tab aktif: background Primary, teks putih, border Primary.
- Tab non-aktif: background putih, teks hitam.

---

## 4. State Management Visual

Setiap halaman yang memuat data dari API WAJIB menangani 3 kondisi berikut secara eksplisit:

1. **Loading State:** Tampilkan teks sederhana "Memuat..." di tengah halaman (rata tengah, margin-top 40px). TIDAK BOLEH membiarkan halaman kosong/blank saat menunggu response API.
2. **Empty State:** Jika data kosong (misal belum ada pendaftar, belum ada pengumuman, belum ada berkas), tampilkan pesan informatif dalam Card atau baris tabel, warna teks abu-abu (`#888888`). Contoh: "Belum ada pengumuman.", "Tidak ada data.".
3. **Error State:** Tampilkan pesan error dalam kotak alert (`.alert-error`, background `#FDECEA`, teks `#C62828`) di bagian atas konten, SEBELUM form/tabel. Pesan error HARUS mengambil dari response API (`message`), bukan pesan generik seperti "Terjadi kesalahan".

Setelah aksi berhasil (submit form, upload, verifikasi), sistem HARUS menampilkan alert sukses (`.alert-success`, background `#E8F5E9`, teks `#2E7D32`) sebelum data ter-refresh.

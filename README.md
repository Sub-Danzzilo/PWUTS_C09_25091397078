# PWUTS_C09_25091397078

UTS Pemrograman Web – SIPTA (Sistem Peminjaman dan Sewa Alat dan Ruangan), Fakultas Vokasi UNESA.
Mahasiswa: Muhammad Riski (25091397078), kelas 2025C.

## Bagian yang saya kerjakan (alur Status & Pembayaran)

- **2.a** `index.html` + `css/style.css` + `js/main.js`: layout sidebar + header + Beranda (ringkasan dan aktivitas terkini dari database), responsive (< 800px sidebar jadi menu geser). Menu memuat halaman dengan Ajax (`$.load`).
- **2.b** `pages/konten.html` + `js/konten.js`: Status & Riwayat. Tab Status Berjalan (kartu) dan Riwayat Transaksi (tabel), banner pengajuan terbaru ditolak, filter jenis, pencarian ID/item.
- **2.c** `pages/form.html` + `js/validasi.js` + `process.php`: unggah/unggah ulang bukti bayar ke tabel `pembayaran`. Validasi jQuery (transaksi wajib, nominal = total biaya, JPG/PNG/PDF maks 2 MB); server memvalidasi ulang.

## Menjalankan (Laragon)

1. Salin folder ke `laragon/www/`, jalankan Apache dan MySQL.
2. Impor `sipta.sql` (HeidiSQL, atau `mysql -u root < sipta.sql`). Database bernama `sipta`, user `root` tanpa password.
3. Buka `http://localhost/PWUTS_C09_25091397078/`.

## Catatan

- Struktur tabel mengikuti proposal (8 tabel). `data.php` mengambil data, `process.php` menulis ke `pembayaran`.
- Bagian yang sudah ada di wireframe tapi tidak didukung struktur database proposal mengikuti proposal: ID transaksi diturunkan (`ALT-`/`RNG-` + nomor), dan alasan admin untuk bukti tidak valid tidak ditampilkan (tabel `pembayaran` tidak punya kolom alasan).
- Login belum ada, mahasiswa contoh dipilih lewat `$ID_PENGGUNA` di `koneksi.php`. Tombol Logout hanya simulasi tampilan.
- Alat dan Ruangan dikerjakan anggota lain; tampilan dan kode tiap anggota dibuat sendiri.

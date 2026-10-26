# PWUTS_C09_25091397078

UTS Pemrograman Web – SIPTA (Sistem Peminjaman dan Sewa Alat dan Ruangan), Fakultas Vokasi UNESA.
Mahasiswa: Muhammad Riski (25091397078), kelas 2025C.

## Bagian yang saya kerjakan (alur Status & Pembayaran)

- **2.a** `index.html` + `css/style.css`: layout sidebar + header, responsive (sidebar jadi menu geser di layar < 800px). Menu memuat halaman dengan Ajax (`$.load`) lewat `js/main.js`.
- **2.b** `pages/konten.html` + `js/konten.js`: Status & Riwayat. Tab Status Berjalan / Riwayat Transaksi, filter jenis, pencarian ID/item, tombol bayar pada transaksi `menunggu_pembayaran`.
- **2.c** `pages/form.html` + `js/validasi.js` + `process.php`: form unggah bukti bayar (tabel `pembayaran`). Validasi jQuery: transaksi wajib dipilih, nominal angka dan harus sama dengan total biaya, berkas JPG/PNG/PDF maks 2 MB.

## Menjalankan

Salin folder ke `laragon/www/`, buka `http://localhost/PWUTS_C09_25091397078/`. Ajax tidak jalan lewat `file://`.

## Catatan

- Data transaksi masih data contoh di `js/konten.js` (belum terhubung database).
- Istilah status mengikuti proposal: `menunggu`, `disetujui`, `ditolak`, `dipinjam`, `dikembalikan`, `menunggu_pembayaran`, `selesai`.
- Pembagian alur: Alat dan Ruangan dikerjakan anggota lain; tampilan dan kode tiap anggota dibuat sendiri.

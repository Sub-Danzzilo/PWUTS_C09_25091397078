CREATE DATABASE IF NOT EXISTS sipta CHARACTER SET utf8mb4;
USE sipta;
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS pembayaran, detail_peminjaman_alat, peminjaman_alat, peminjaman_ruangan, fasilitas_ruangan, ruangan, alat, pengguna;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE pengguna (
  id_pengguna INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(100) NOT NULL,
  nomor_induk VARCHAR(30) NULL UNIQUE, email VARCHAR(100) NOT NULL UNIQUE,
  no_telepon VARCHAR(20), unit_prodi VARCHAR(100), password VARCHAR(255) NOT NULL,
  peran ENUM('mahasiswa','admin') NOT NULL);
CREATE TABLE alat (
  id_alat INT AUTO_INCREMENT PRIMARY KEY, nama_alat VARCHAR(100) NOT NULL, deskripsi TEXT,
  jumlah_total INT NOT NULL, jumlah_tersedia INT NOT NULL,
  kondisi ENUM('baik','rusak ringan','rusak berat') NOT NULL DEFAULT 'baik');
CREATE TABLE ruangan (
  id_ruangan INT AUTO_INCREMENT PRIMARY KEY, nama_ruangan VARCHAR(100) NOT NULL, kapasitas INT,
  tarif_akhir_pekan DECIMAL(10,2) NOT NULL DEFAULT 0, status ENUM('tersedia','tidak tersedia') NOT NULL);
CREATE TABLE fasilitas_ruangan (
  id_fasilitas INT AUTO_INCREMENT PRIMARY KEY, id_ruangan INT NOT NULL, nama_fasilitas VARCHAR(100), jumlah INT,
  FOREIGN KEY (id_ruangan) REFERENCES ruangan(id_ruangan));
CREATE TABLE peminjaman_alat (
  id_pinjam_alat INT AUTO_INCREMENT PRIMARY KEY, id_pengguna INT NOT NULL, id_admin INT NULL,
  tgl_pengajuan DATETIME NOT NULL, tgl_pinjam DATE NOT NULL, tgl_kembali_rencana DATE NOT NULL,
  tgl_kembali_aktual DATE NULL, keperluan TEXT,
  status ENUM('menunggu','disetujui','ditolak','dipinjam','dikembalikan') NOT NULL DEFAULT 'menunggu',
  alasan_penolakan TEXT NULL,
  FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna), FOREIGN KEY (id_admin) REFERENCES pengguna(id_pengguna));
CREATE TABLE detail_peminjaman_alat (
  id_detail INT AUTO_INCREMENT PRIMARY KEY, id_pinjam_alat INT NOT NULL, id_alat INT NOT NULL, jumlah INT NOT NULL,
  FOREIGN KEY (id_pinjam_alat) REFERENCES peminjaman_alat(id_pinjam_alat), FOREIGN KEY (id_alat) REFERENCES alat(id_alat));
CREATE TABLE peminjaman_ruangan (
  id_pinjam_ruangan INT AUTO_INCREMENT PRIMARY KEY, id_pengguna INT NOT NULL, id_ruangan INT NOT NULL, id_admin INT NULL,
  tgl_pengajuan DATETIME NOT NULL, tgl_pinjam DATE NOT NULL, jam_mulai TIME NOT NULL, jam_selesai TIME NOT NULL,
  keperluan TEXT, file_surat VARCHAR(255), jenis_hari ENUM('hari_kerja','akhir_pekan') NOT NULL,
  total_biaya DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('menunggu','disetujui','ditolak','menunggu_pembayaran','selesai') NOT NULL DEFAULT 'menunggu',
  alasan_penolakan TEXT NULL,
  FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna), FOREIGN KEY (id_ruangan) REFERENCES ruangan(id_ruangan),
  FOREIGN KEY (id_admin) REFERENCES pengguna(id_pengguna));
CREATE TABLE pembayaran (
  id_pembayaran INT AUTO_INCREMENT PRIMARY KEY, id_pinjam_ruangan INT NOT NULL UNIQUE, id_admin INT NULL,
  jumlah_bayar DECIMAL(10,2) NOT NULL, bukti_pembayaran VARCHAR(255) NOT NULL, tgl_unggah DATETIME NOT NULL,
  status_verifikasi ENUM('menunggu','valid','tidak_valid') NOT NULL DEFAULT 'menunggu', tgl_verifikasi DATETIME NULL,
  FOREIGN KEY (id_pinjam_ruangan) REFERENCES peminjaman_ruangan(id_pinjam_ruangan), FOREIGN KEY (id_admin) REFERENCES pengguna(id_pengguna));

-- Data contoh (password = hash palsu, login bukan bagian alur ini)
INSERT INTO pengguna VALUES
 (1,'John Doe','1234567890','john@mhs.unesa.ac.id','081200000001','D4 Manajemen Informatika','$2y$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhas','mahasiswa'),
 (2,'Admin TU Vokasi',NULL,'admin@vokasi.unesa.ac.id','081200000002','Tata Usaha Fakultas Vokasi','$2y$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhas','admin');
INSERT INTO alat VALUES
 (1,'Kamera DSLR','24.2MP, APS-C, ISO 100-25600, 1080p 60fps, kit lensa 18-55mm.',3,3,'baik'),
 (2,'Drone','4K 30fps, 3-axis gimbal, 30 menit flight time, remote control.',1,1,'baik'),
 (3,'Proyektor','1080p, 3500 lumens, HDMI x2, USB reader, remote control.',1,0,'baik'),
 (4,'Lensa 50mm f/1.8','Prime lens, aperture f/1.8-16, manual focus ring, mount EF-S.',2,2,'baik'),
 (5,'Tripod','Max load 5kg, 3-section leg, panhead, quick release plate.',6,5,'baik'),
 (6,'Mikrofon Lavalier','Wireless lavalier, receiver 1/4", battery life 8 jam, windscreen.',1,0,'baik');
INSERT INTO ruangan VALUES
 (1,'Ruang Kuliah 301',40,250000,'tersedia'),(2,'Auditorium',200,1500000,'tersedia'),(3,'Ruang Rapat',20,200000,'tidak tersedia'),
 (4,'Ruang Kuliah 302',40,250000,'tersedia'),(5,'Aula Vokasi',100,750000,'tersedia'),(6,'Ruang Seminar',60,500000,'tidak tersedia');
INSERT INTO fasilitas_ruangan (id_ruangan,nama_fasilitas,jumlah)
 SELECT r.id_ruangan, f.n, 1 FROM ruangan r JOIN (SELECT 'Proyektor' n UNION SELECT 'AC' UNION SELECT 'Papan Tulis') f;

INSERT INTO peminjaman_alat VALUES
 (1,1,2,'2026-09-28 09:00:00','2026-09-30','2026-10-02','2026-10-02','Presentasi tugas kuliah','dikembalikan',NULL),
 (2,1,2,'2026-10-05 10:00:00','2026-10-07','2026-10-09',NULL,'Dokumentasi kegiatan kelas','dipinjam',NULL),
 (3,1,2,'2026-10-02 08:30:00','2026-10-05','2026-10-07','2026-10-07','Proyek tugas akhir','dikembalikan',NULL),
 (4,1,2,'2026-10-05 13:00:00','2026-10-09','2026-10-10',NULL,'Pengambilan footage','ditolak','Drone sedang dalam perawatan dan tidak tersedia pada tanggal yang diajukan.'),
 (5,1,NULL,'2026-10-08 09:15:00','2026-10-09','2026-10-12',NULL,'Proyek tugas akhir','menunggu',NULL);
INSERT INTO detail_peminjaman_alat (id_pinjam_alat,id_alat,jumlah) VALUES (1,3,1),(2,5,1),(3,1,1),(4,2,1),(5,1,1);

INSERT INTO peminjaman_ruangan VALUES
 (1,1,5,2,'2026-09-29 09:00:00','2026-10-04','08:00:00','16:00:00','Workshop akhir pekan','surat/aula.pdf','akhir_pekan',750000,'selesai',NULL),
 (2,1,1,2,'2026-10-01 09:00:00','2026-10-06','09:00:00','12:00:00','Pertemuan kelompok','surat/k301.pdf','hari_kerja',0,'selesai',NULL),
 (3,1,3,2,'2026-10-01 11:00:00','2026-10-07','13:00:00','15:00:00','Rapat organisasi','surat/rapat.pdf','hari_kerja',0,'ditolak','Ruangan digunakan untuk rapat fakultas pada jadwal yang diajukan.'),
 (4,1,1,2,'2026-10-06 09:30:00','2026-10-10','09:00:00','12:00:00','Workshop persiapan tugas akhir untuk 35 mahasiswa Fakultas Vokasi.','surat/ws.pdf','akhir_pekan',250000,'menunggu_pembayaran',NULL),
 (5,1,2,2,'2026-10-05 14:00:00','2026-10-11','08:00:00','16:00:00','Seminar nasional','surat/seminar.pdf','akhir_pekan',1500000,'menunggu_pembayaran',NULL),
 (6,1,4,2,'2026-10-07 10:00:00','2026-10-09','10:00:00','12:00:00','Kelas tambahan','surat/k302.pdf','hari_kerja',0,'disetujui',NULL);
INSERT INTO pembayaran (id_pinjam_ruangan,id_admin,jumlah_bayar,bukti_pembayaran,tgl_unggah,status_verifikasi,tgl_verifikasi) VALUES
 (1,2,750000,'uploads/bukti-aula.jpg','2026-09-30 10:00:00','valid','2026-09-30 13:00:00'),
 (5,2,1000000,'uploads/bukti-transfer-auditorium.jpg','2026-10-07 10:00:00','tidak_valid','2026-10-07 14:00:00');

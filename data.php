<?php
require 'koneksi.php';
header('Content-Type: application/json');
$u = $db->prepare('SELECT nama, nomor_induk FROM pengguna WHERE id_pengguna=?');
$u->bind_param('i', $ID_PENGGUNA); $u->execute();
$user = $u->get_result()->fetch_assoc();
$sql = "SELECT 'alat' jenis, a.id_pinjam_alat id, a.tgl_pengajuan, a.tgl_pinjam, NULL jam_mulai, NULL jam_selesai,
  a.tgl_kembali_rencana rencana, a.tgl_kembali_aktual aktual, a.keperluan, a.status, a.alasan_penolakan alasan,
  NULL jenis_hari, NULL total, NULL pay_status, NULL pay_file, NULL pay_jumlah, NULL pay_tgl,
  (SELECT GROUP_CONCAT(CONCAT(al.nama_alat, IF(d.jumlah>1, CONCAT(' x', d.jumlah), '')) SEPARATOR ', ')
     FROM detail_peminjaman_alat d JOIN alat al ON al.id_alat=d.id_alat WHERE d.id_pinjam_alat=a.id_pinjam_alat) item
  FROM peminjaman_alat a WHERE a.id_pengguna=?
  UNION ALL
  SELECT 'ruangan', r.id_pinjam_ruangan, r.tgl_pengajuan, r.tgl_pinjam, r.jam_mulai, r.jam_selesai,
  r.tgl_pinjam, IF(r.status='selesai', r.tgl_pinjam, NULL), r.keperluan, r.status, r.alasan_penolakan,
  r.jenis_hari, r.total_biaya, p.status_verifikasi, p.bukti_pembayaran, p.jumlah_bayar, p.tgl_unggah, ru.nama_ruangan
  FROM peminjaman_ruangan r JOIN ruangan ru ON ru.id_ruangan=r.id_ruangan
  LEFT JOIN pembayaran p ON p.id_pinjam_ruangan=r.id_pinjam_ruangan WHERE r.id_pengguna=?
  ORDER BY tgl_pengajuan DESC";
$q = $db->prepare($sql);
$q->bind_param('ii', $ID_PENGGUNA, $ID_PENGGUNA); $q->execute();
echo json_encode(['user' => $user, 'trx' => $q->get_result()->fetch_all(MYSQLI_ASSOC)]);

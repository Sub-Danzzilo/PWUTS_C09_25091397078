<?php
header('Content-Type: application/json');
$id  = $_POST['id_pinjam_ruangan'] ?? '';
$jml = (int) preg_replace('/\D/', '', $_POST['jumlah_bayar'] ?? '');
$f   = $_FILES['bukti'] ?? null;
$ext = strtolower(pathinfo($f['name'] ?? '', PATHINFO_EXTENSION));
if (!$id || $jml <= 0 || !$f || $f['error'] !== 0 || $f['size'] > 2 * 1024 * 1024 || !in_array($ext, ['jpg', 'jpeg', 'png', 'pdf'])) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'pesan' => 'Data tidak valid. Periksa nominal dan berkas bukti.']);
  exit;
}
@mkdir('uploads', 0777, true);
$nama = 'bukti_' . preg_replace('/[^A-Za-z0-9-]/', '', $id) . '_' . time() . '.' . $ext;
move_uploaded_file($f['tmp_name'], 'uploads/' . $nama);
echo json_encode(['ok' => true, 'pesan' => 'Bukti terkirim. Status pembayaran: menunggu verifikasi admin.', 'file' => $nama]);

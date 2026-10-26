<?php
require 'koneksi.php';
header('Content-Type: application/json');

function out($ok, $m, $c = 200)
{
    http_response_code($c);
    echo json_encode(['ok' => $ok, 'pesan' => $m]);
    exit;
}

$id = (int) ($_POST['id_pinjam_ruangan'] ?? 0);
$jml = (int) preg_replace('/\D/', '', $_POST['jumlah_bayar'] ?? '');
$f = $_FILES['bukti'] ?? null;
$ext = strtolower(pathinfo($f['name'] ?? '', PATHINFO_EXTENSION));

if (
    !$id
    || $jml <= 0
    || !$f
    || $f['error'] !== 0
    || $f['size'] > 2 * 1024 * 1024
    || !in_array($ext, ['jpg', 'jpeg', 'png', 'pdf'])
) {
    out(false, 'Data tidak valid. Periksa nominal dan berkas bukti.', 422);
}

$s = $db->prepare(
    "SELECT total_biaya
    FROM peminjaman_ruangan
    WHERE id_pinjam_ruangan=?
      AND id_pengguna=?
      AND status='menunggu_pembayaran'"
);
$s->bind_param('ii', $id, $ID_PENGGUNA);
$s->execute();
$row = $s->get_result()->fetch_assoc();

if (!$row) {
    out(false, 'Transaksi tidak ditemukan atau tidak sedang menunggu pembayaran.', 404);
}

if ((int) $row['total_biaya'] !== $jml) {
    out(false, 'Nominal harus sama dengan total biaya.', 422);
}

$p = $db->prepare(
    'SELECT status_verifikasi FROM pembayaran WHERE id_pinjam_ruangan=?'
);
$p->bind_param('i', $id);
$p->execute();
$ada = $p->get_result()->fetch_assoc();

if ($ada && $ada['status_verifikasi'] !== 'tidak_valid') {
    out(false, 'Bukti bayar sudah diunggah dan sedang diproses admin.', 409);
}

@mkdir('uploads', 0777, true);
$path = 'uploads/bukti_' . $id . '_' . time() . '.' . $ext;

if (!move_uploaded_file($f['tmp_name'], $path)) {
    out(false, 'Berkas gagal disimpan di server.', 500);
}

if ($ada) { // unggah ulang: pakai catatan pembayaran yang sama
    $w = $db->prepare(
        "UPDATE pembayaran
        SET id_admin=NULL, jumlah_bayar=?, bukti_pembayaran=?, tgl_unggah=NOW(),
            status_verifikasi='menunggu', tgl_verifikasi=NULL
        WHERE id_pinjam_ruangan=?"
    );
    $w->bind_param('isi', $jml, $path, $id);
} else {
    $w = $db->prepare(
        "INSERT INTO pembayaran (
            id_pinjam_ruangan, jumlah_bayar, bukti_pembayaran, tgl_unggah,
            status_verifikasi
        ) VALUES (?,?,?,NOW(),'menunggu')"
    );
    $w->bind_param('iis', $id, $jml, $path);
}

$w->execute();

out(true, 'Bukti terkirim. Status pembayaran: menunggu verifikasi admin.');

<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$ID_PENGGUNA = 1; // mahasiswa contoh (Muhammad Riski); login dikerjakan bagian lain

try {
    $db = new mysqli('localhost', 'root', '', 'sipta'); // default Laragon
    $db->set_charset('utf8mb4');
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'ok' => false,
        'pesan' => 'Koneksi database gagal. Aktifkan MySQL di Laragon dan impor sipta.sql.',
    ]);
    exit;
}

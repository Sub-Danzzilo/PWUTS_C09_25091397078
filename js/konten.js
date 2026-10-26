var TRX = [
  {id:'TRX-2610-019',jenis:'Ruangan',item:'Ruang Kuliah 301',status:'menunggu_pembayaran',ajuan:'6 Okt 2026',pinjam:'Sabtu, 10 Okt 2026',ket:'09.00–12.00',total:250000},
  {id:'TRX-2610-018',jenis:'Ruangan',item:'Auditorium',status:'menunggu_pembayaran',ajuan:'5 Okt 2026',pinjam:'Minggu, 11 Okt 2026',ket:'08.00–16.00',total:1500000,alasan:'Bukti bayar tidak valid: nominal transfer Rp1.000.000 belum sesuai total biaya Rp1.500.000.'},
  {id:'TRX-2610-021',jenis:'Alat',item:'Kamera DSLR',status:'menunggu',ajuan:'8 Okt 2026',pinjam:'Jumat, 9 Okt 2026',ket:'Rencana kembali 12 Okt 2026'},
  {id:'TRX-2610-020',jenis:'Ruangan',item:'Ruang Kuliah 302',status:'disetujui',ajuan:'7 Okt 2026',pinjam:'Jumat, 9 Okt 2026',ket:'10.00–12.00 (hari kerja)'},
  {id:'TRX-2610-017',jenis:'Alat',item:'Tripod',status:'dipinjam',ajuan:'5 Okt 2026',pinjam:'Rabu, 7 Okt 2026',ket:'Rencana kembali 9 Okt 2026'},
  {id:'TRX-2610-014',jenis:'Alat',item:'Drone',status:'ditolak',ajuan:'5 Okt 2026',pinjam:'9 Okt 2026',ket:'Tidak digunakan',alasan:'Alasan penolakan: Drone sedang dalam perawatan dan tidak tersedia pada tanggal yang diajukan.'},
  {id:'TRX-2610-016',jenis:'Alat',item:'Kamera DSLR',status:'dikembalikan',ajuan:'2 Okt 2026',pinjam:'5 Okt 2026',ket:'Kembali 7 Okt 2026'},
  {id:'TRX-2610-015',jenis:'Ruangan',item:'Ruang Kuliah 301',status:'selesai',ajuan:'1 Okt 2026',pinjam:'6 Okt 2026',ket:'09.00–12.00'},
  {id:'TRX-2610-013',jenis:'Ruangan',item:'Ruang Rapat',status:'ditolak',ajuan:'1 Okt 2026',pinjam:'7 Okt 2026',ket:'13.00–15.00',alasan:'Alasan penolakan: Ruangan digunakan untuk rapat fakultas pada jadwal yang diajukan.'},
  {id:'TRX-2610-012',jenis:'Ruangan',item:'Aula Vokasi',status:'selesai',ajuan:'29 Sep 2026',pinjam:'4 Okt 2026',ket:'08.00–16.00'},
  {id:'TRX-2609-028',jenis:'Alat',item:'Proyektor',status:'dikembalikan',ajuan:'28 Sep 2026',pinjam:'30 Sep 2026',ket:'Kembali 2 Okt 2026'}
];
var LABEL = {menunggu:'Menunggu',disetujui:'Disetujui',dipinjam:'Dipinjam',menunggu_pembayaran:'Menunggu Pembayaran',ditolak:'Ditolak',dikembalikan:'Dikembalikan',selesai:'Selesai'};
var TUTUP = ['ditolak', 'dikembalikan', 'selesai'];
function rp(n) { return 'Rp' + n.toLocaleString('id-ID'); }
function isTutup(t) { return TUTUP.indexOf(t.status) > -1; }

function initKonten() {
  var tab = 'aktif';
  $('#n-aktif').text(TRX.filter(function (t) { return !isTutup(t); }).length);
  $('#n-riwayat').text(TRX.filter(isTutup).length);

  function render() {
    var j = $('#f-jenis').val(), q = $('#f-cari').val().toLowerCase();
    var rows = TRX.filter(function (t) {
      return isTutup(t) === (tab === 'riwayat') && (!j || t.jenis === j) &&
             (t.id + ' ' + t.item).toLowerCase().indexOf(q) > -1;
    });
    var h = rows.map(function (t) {
      var s = '<article class="card"><div><small>' + t.id + ' · ' + t.jenis + '</small><h3>' + t.item +
        '</h3><small>Diajukan ' + t.ajuan + '</small></div><div><small>Tanggal pinjam</small><p>' + t.pinjam +
        '</p><small>' + t.ket + '</small></div><div><span class="badge" data-s="' + t.status + '">' + LABEL[t.status] + '</span>';
      if (t.alasan) s += '<p class="note">' + t.alasan + '</p>';
      if (t.status === 'menunggu_pembayaran') {
        s += '<p>Total biaya <b>' + rp(t.total) + '</b></p><button class="btn" data-bayar="' + t.id + '">' +
             (t.alasan ? 'Unggah ulang' : 'Unggah bukti bayar') + '</button>';
      }
      return s + '</div></article>';
    }).join('');
    $('#list').html(h);
    $('#kosong').prop('hidden', rows.length > 0);
  }

  $('.tab').on('click', function () {
    tab = $(this).data('tab');
    $('.tab').removeClass('on'); $(this).addClass('on'); render();
  });
  $('#f-jenis').on('change', render);
  $('#f-cari').on('input', render);
  $('#list').on('click', '[data-bayar]', function () { loadPage('form', $(this).data('bayar')); });
  render();
}

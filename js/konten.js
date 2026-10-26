var BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
var LABEL = {
  menunggu: 'Menunggu',
  disetujui: 'Disetujui',
  dipinjam: 'Dipinjam',
  menunggu_pembayaran: 'Menunggu Pembayaran',
  ditolak: 'Ditolak',
  dikembalikan: 'Dikembalikan',
  selesai: 'Selesai'
};
var PESAN = {
  menunggu: 'Pengajuan sedang menunggu pemeriksaan admin.',
  disetujui: 'Jadwal peminjaman telah disetujui admin.',
  dipinjam: 'Alat telah diambil. Kembalikan sesuai jadwal.'
};
var TUTUP = ['ditolak', 'dikembalikan', 'selesai'];
var DATA = [];

function esc(s) {
  return $('<div>').text(s == null ? '' : s).html();
}

function rp(n) {
  return 'Rp' + Number(n).toLocaleString('id-ID');
}

function fmt(d) {
  if (!d) return '—';
  var p = d.substr(0, 10).split('-');
  return +p[2] + ' ' + BLN[p[1] - 1] + ' ' + p[0];
}

function fmtHari(d) {
  return HARI[new Date(d.substr(0, 10) + 'T00:00:00').getDay()] + ', ' + fmt(d);
}

function jam(t) {
  return t ? t.substr(0, 5).replace(':', '.') : '';
}

function kode(t) {
  return (t.jenis === 'alat' ? 'ALT-' : 'RNG-') + ('0000' + t.id).slice(-4);
}

function jenisLabel(t) {
  return t.jenis === 'alat' ? 'Alat' : 'Ruangan';
}

function isTutup(t) {
  return TUTUP.indexOf(t.status) > -1;
}

function bisaBayar(t) {
  return t.jenis === 'ruangan'
    && t.status === 'menunggu_pembayaran'
    && (!t.pay_status || t.pay_status === 'tidak_valid');
}

function getData(cb) {
  $.getJSON('data.php').done(function (r) {
    DATA = r.trx;
    $('.uname').text(r.user.nama);
    $('.unim').text(r.user.nomor_induk);
    $('.uinit').text(r.user.nama.split(' ').map(function (w) {
      return w[0];
    }).join('').slice(0, 2));
    cb(r);
  }).fail(function () {
    $('#content').html('<p class="note">Data gagal dimuat. Pastikan Apache dan MySQL Laragon aktif dan sipta.sql sudah diimpor.</p>');
  });
}

function kartu(t) {
  var mid = '<p>' + fmtHari(t.tgl_pinjam) + '</p><small>' + (t.jenis === 'alat'
    ? 'Rencana kembali: ' + fmt(t.rencana)
    : jam(t.jam_mulai) + '–' + jam(t.jam_selesai) + ' · '
      + (t.jenis_hari === 'akhir_pekan' ? 'Akhir pekan' : 'Hari kerja')) + '</small>';
  var r = '<span class="badge" data-s="' + t.status + '">' + LABEL[t.status] + '</span>';
  if (t.status === 'menunggu_pembayaran') {
    if (t.pay_status === 'tidak_valid') {
      r += '<div class="proof"><b>Bukti bayar tidak valid</b><br><small>'
        + esc(t.pay_file.split('/').pop()) + ' · ' + fmt(t.pay_tgl)
        + '</small><br>Nominal yang diunggah ' + rp(t.pay_jumlah)
        + '. Unggah ulang bukti yang sesuai total biaya.</div>';
    } else {
      r += '<p>' + (t.pay_status === 'menunggu'
        ? 'Bukti bayar sudah diunggah dan menunggu verifikasi admin.'
        : 'Belum ada bukti bayar.') + '</p>';
    }
    r += '<p><small>Total Biaya</small><br><b>' + rp(t.total) + '</b></p>';
    if (bisaBayar(t)) {
      r += '<button class="btn" data-bayar="' + t.id + '">'
        + (t.pay_status ? 'Unggah ulang' : 'Unggah bukti bayar') + '</button>';
    }
  } else {
    r += '<p>' + PESAN[t.status] + '</p>';
  }
  return '<article class="card"><div><small>' + kode(t) + ' · ' + jenisLabel(t)
    + '</small><h3>' + esc(t.item) + '</h3><small>Tanggal pengajuan: '
    + fmt(t.tgl_pengajuan) + '</small></div><div><small>Tanggal pinjam</small>' + mid
    + '</div><div>' + r + '</div></article>';
}

function baris(t) {
  var alat = t.jenis === 'alat';
  var jd = alat ? '' : '<br><small>' + jam(t.jam_mulai) + '–' + jam(t.jam_selesai) + '</small>';
  if (t.status === 'ditolak') jd += '<br><small>Jadwal diajukan</small>';
  var rc = alat
    ? fmt(t.rencana)
    : fmt(t.tgl_pinjam) + '<br>' + jam(t.jam_selesai);
  var ak = t.aktual
    ? fmt(t.aktual) + (alat ? '' : '<br>' + jam(t.jam_selesai))
    : '—<br><small>Tidak digunakan</small>';
  var h = '<tr><td><b>' + kode(t) + '</b><br><small>Diajukan: '
    + fmt(t.tgl_pengajuan) + '</small></td><td>' + jenisLabel(t)
    + '</td><td><b>' + esc(t.item) + '</b></td><td>' + fmt(t.tgl_pinjam) + jd
    + '</td><td>' + rc + '</td><td>' + ak + '</td><td><span class="badge" data-s="'
    + t.status + '">' + LABEL[t.status] + '</span></td></tr>';
  if (t.alasan) h += '<tr><td colspan="7"><div class="note">Alasan penolakan: ' + esc(t.alasan) + '</div></td></tr>';
  return h;
}

function initKonten() {
  getData(function () {
    var tab = 'aktif';
    var aktif = DATA.filter(function (t) {
      return !isTutup(t);
    });
    var tutup = DATA.filter(isTutup);
    var bayar = aktif.filter(function (t) {
      return t.status === 'menunggu_pembayaran';
    }).length;
    var tolak = tutup.filter(function (t) {
      return t.status === 'ditolak';
    })[0]; // data sudah urut terbaru
    $('#n-aktif').text(aktif.length);
    $('#n-riwayat').text(tutup.length);

    function render() {
      var j = $('#f-jenis').val();
      var q = $('#f-cari').val().toLowerCase();
      var rows = (tab === 'aktif' ? aktif : tutup).filter(function (t) {
        return (!j || t.jenis === j)
          && (kode(t) + ' ' + t.item).toLowerCase().indexOf(q) > -1;
      });
      var h = '';
      if (tab === 'aktif') {
        if (tolak) {
          h += '<div class="banner"><b>Pengajuan terbaru ditolak · ' + kode(tolak)
            + ' · ' + jenisLabel(tolak) + ' — ' + esc(tolak.item)
            + '</b><br>Alasan penolakan: ' + esc(tolak.alasan)
            + '<br><small>Tanggal pinjam: ' + fmt(tolak.tgl_pinjam)
            + ' · Transaksi sudah ditutup dan masuk Riwayat Transaksi.</small></div>';
        }
        h += '<div class="sh"><h3>Pengajuan Aktif</h3><small>' + aktif.length
          + ' transaksi · ' + bayar + ' menunggu pembayaran</small></div>'
          + rows.map(kartu).join('');
        $('#foot').html(
          'Pembayaran ruangan Sabtu/Minggu dilakukan di luar sistem. Bukti bayar yang diunggah akan diverifikasi oleh admin.<br>'
          + 'Peminjaman alat dan ruangan hari kerja tidak dikenakan biaya dan tidak memerlukan bukti bayar.'
        );
      } else {
        h += '<div class="sh"><h3>Transaksi Tertutup</h3><small>' + tutup.length
          + ' transaksi tertutup</small></div>'
          + '<p class="mut">Hanya transaksi Dikembalikan, Selesai, dan Ditolak.</p>'
          + '<div class="tw"><table class="tbl"><thead><tr>'
          + '<th>ID Transaksi / Nomor Referensi</th><th>Jenis Peminjaman</th><th>Item</th>'
          + '<th>Tanggal Pinjam</th><th>Tanggal Kembali / Selesai (Rencana)</th>'
          + '<th>Tanggal Kembali / Selesai (Aktual)</th><th>Status Akhir</th>'
          + '</tr></thead><tbody>' + rows.map(baris).join('')
          + '</tbody></table></div><small>Menampilkan ' + rows.length + ' dari '
          + tutup.length + ' transaksi</small>';
        $('#foot').html(
          'Alat: tanggal kembali rencana dan aktual. Ruangan: tanggal serta jam selesai penggunaan, bukan pengembalian alat.<br>'
          + 'Ditolak: jadwal yang diajukan tetap tercatat; tanggal aktual — karena peminjaman tidak digunakan.'
        );
      }
      $('#list').html(h);
      $('#kosong').prop('hidden', rows.length > 0);
    }

    $('.tab').on('click', function () {
      tab = $(this).data('tab');
      $('.tab').removeClass('on');
      $(this).addClass('on');
      render();
    });
    $('#f-jenis').on('change', render);
    $('#f-cari').on('input', render);
    $('#list').on('click', '[data-bayar]', function () {
      loadPage('form', $(this).data('bayar'));
    });
    render();
  });
}

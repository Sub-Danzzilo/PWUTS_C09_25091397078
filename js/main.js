function initBeranda() {
  getData(function () {
    var c = function (s) {
      return DATA.filter(function (t) {
        return t.status === s;
      }).length;
    };
    $('#s-menunggu').text(c('menunggu'));
    $('#s-bayar').text(c('menunggu_pembayaran'));
    $('#s-pinjam').text(c('dipinjam'));
    $('#aktivitas').html(DATA.slice(0, 6).map(function (t) {
      return '<tr><td>' + jenisLabel(t) + ' – ' + esc(t.item) + '</td><td>'
        + fmt(t.tgl_pengajuan) + '</td><td>' + esc(t.keperluan)
        + '</td><td><span class="badge" data-s="' + t.status + '">'
        + LABEL[t.status] + '</span></td></tr>';
    }).join(''));
  });
}

$(function () {
  var home = $('#content').html();
  window.loadPage = function (p, arg) {
    $('#side nav a')
      .removeClass('on')
      .filter('[data-page="' + p + '"]')
      .addClass('on');
    $('#side').removeClass('open');
    if (p === 'beranda') {
      $('#content').html(home);
      initBeranda();
      return;
    }
    $('#content').html('<p class="mut">Memuat…</p>').load('pages/' + p + '.html', function (res, st) {
      if (st === 'error') {
        $(this).html('<p class="note">Halaman gagal dimuat. Buka lewat server lokal (Laragon), bukan file://.</p>');
        return;
      }
      if (p === 'konten') {
        initKonten();
      } else if (p === 'form') {
        initForm(arg);
      }
    });
  };
  $('#side nav a').on('click', function (e) {
    e.preventDefault();
    loadPage($(this).data('page'));
  });
  $('#burger').on('click', function () {
    $('#side').toggleClass('open');
  });
  $('#content').on('click', '[data-go]', function () {
    loadPage($(this).data('go'));
  });
  $('#side .out').on('click', function (e) {
    e.preventDefault();
    if (!confirm('Keluar dari SIPTA?')) return;
    $('#side nav').hide();
    $('#content').html(
      '<section class="page"><h2>Anda sudah keluar</h2>'
      + '<p class="mut">Sesi berakhir. Halaman login belum tersedia di bagian ini.</p>'
      + '<button class="btn" onclick="location.reload()">Masuk kembali</button></section>'
    );
  });
  initBeranda();
});

$(function () {
  var home = $('#content').html();
  window.loadPage = function (p, arg) {
    $('#side nav a').removeClass('on').filter('[data-page="' + p + '"]').addClass('on');
    $('#side').removeClass('open');
    if (p === 'beranda') { $('#content').html(home); return; }
    $('#content').html('<p class="mut">Memuat…</p>').load('pages/' + p + '.html', function (res, st) {
      if (st === 'error') {
        $(this).html('<p class="note">Halaman gagal dimuat. Buka lewat server lokal (Laragon), bukan file://.</p>');
        return;
      }
      if (p === 'konten') initKonten(); else if (p === 'form') initForm(arg);
    });
  };
  $('#side nav a').on('click', function (e) { e.preventDefault(); loadPage($(this).data('page')); });
  $('#burger').on('click', function () { $('#side').toggleClass('open'); });
  $('#content').on('click', '[data-go]', function () { loadPage($(this).data('go')); });
});

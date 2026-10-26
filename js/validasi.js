function initForm(preId) {
  getData(function () {
    var MAX = 2 * 1024 * 1024, EXT = ['jpg', 'jpeg', 'png', 'pdf'];
    var due = DATA.filter(bisaBayar), $t = $('#trx');
    if (!due.length) {
      $('#frm').replaceWith('<p class="info">Tidak ada transaksi yang perlu dibayar atau diunggah ulang.</p>');
      return;
    }
    $t.append('<option value="">Pilih transaksi…</option>');
    due.forEach(function (t) { $t.append('<option value="' + t.id + '">' + kode(t) + ' – ' + esc(t.item) + '</option>'); });
    if (preId) $t.val(preId);

    function cur() { return due.filter(function (t) { return String(t.id) === $t.val(); })[0]; }
    function showInfo() {
      var t = cur();
      $('#info').text(t ? 'Total biaya ' + rp(t.total) + ' · pinjam ' + fmt(t.tgl_pinjam) : 'Pilih transaksi untuk melihat total biaya.');
    }
    function err($el, msg) { $el.toggleClass('invalid', !!msg).parent().find('.err').text(msg || ''); return !msg; }
    function vTrx() { return err($t, $t.val() ? '' : 'Pilih transaksi yang akan dibayar.'); }
    function vJml() {
      var raw = $('#jml').val().replace(/\./g, '').trim(), t = cur(), m = '';
      if (!raw) m = 'Jumlah dibayar wajib diisi.';
      else if (!/^\d+$/.test(raw)) m = 'Isi angka saja, tanpa huruf atau simbol.';
      else if (t && +raw !== Number(t.total)) m = 'Nominal harus sama dengan total biaya ' + rp(t.total) + '.';
      return err($('#jml'), m);
    }
    function vFile() {
      var f = $('#bukti')[0].files[0], m = '';
      if (!f) m = 'Bukti pembayaran wajib dipilih.';
      else if (EXT.indexOf(f.name.split('.').pop().toLowerCase()) < 0) m = 'Format harus JPG, PNG, atau PDF.';
      else if (f.size > MAX) m = 'Ukuran file maksimal 2 MB.';
      return err($('#bukti'), m);
    }

    $t.on('change', function () { showInfo(); vTrx(); });
    $('#jml').on('blur', vJml);
    $('#bukti').on('change', function () {
      var f = this.files[0];
      if (vFile() && f && f.type.indexOf('image') === 0) $('#prev').attr('src', URL.createObjectURL(f)).prop('hidden', false);
      else $('#prev').prop('hidden', true);
    });
    $('#batal').on('click', function () { loadPage('konten'); });
    $('#frm').on('submit', function (e) {
      e.preventDefault();
      if (![vTrx(), vJml(), vFile()].every(Boolean)) { $('#hasil').attr('class', 'no').text('Periksa kembali isian yang bertanda merah.'); return; }
      $.ajax({url: this.action, method: 'POST', data: new FormData(this), processData: false, contentType: false, dataType: 'json'})
        .done(function (r) { $('#hasil').attr('class', 'ok').text(r.pesan); setTimeout(function () { loadPage('konten'); }, 1200); })
        .fail(function (x) { $('#hasil').attr('class', 'no').text((x.responseJSON && x.responseJSON.pesan) || 'Server tidak merespons. Jalankan lewat Laragon.'); });
    });
    showInfo();
  });
}

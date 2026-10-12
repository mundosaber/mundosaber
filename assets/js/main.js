/* MundoSaber — main.js
   Mobile menu, search, share buttons, sticky share bar (mobile articles),
   FAQ accordion, newsletter + contact forms (mailto), date fill, footer year */

(function () {
  'use strict';

  var CONTACT_EMAIL = 'Mayaprincess_writer@gmail.com';
  var lang = (document.documentElement.lang || 'es').toLowerCase();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  /* ---------- Search ---------- */
  var searchToggle = document.getElementById('searchToggle');
  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function () {
      searchForm.classList.toggle('open');
      if (searchForm.classList.contains('open') && searchInput) searchInput.focus();
    });
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = searchInput ? searchInput.value.trim() : '';
      if (!q) return;
      var site = 'mundosaber-gepc.onrender.com';
      window.location.href = 'https://www.google.com/search?q=site:' + site + '+' + encodeURIComponent(q);
    });
  }

  /* ---------- Date fill (utility bar + masthead) ---------- */
  var now = new Date();
  var locale = lang === 'pt' ? 'pt-BR' : 'es-ES';
  function fmtShort(d) {
    try {
      return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return d.toDateString(); }
  }
  function fmtLong(d) {
    try {
      var s = d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch (e) { return d.toDateString(); }
  }
  document.querySelectorAll('[data-date]').forEach(function (el) { el.textContent = fmtShort(now); });
  document.querySelectorAll('[data-date-long]').forEach(function (el) { el.textContent = fmtLong(now); });

  /* ---------- Share buttons (in-article share-bar) ---------- */
  function shareUrl() { return window.location.href; }
  function shareTitle() { return document.title; }

  document.querySelectorAll('.share-bar [data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-share');
      var url = encodeURIComponent(shareUrl());
      var text = encodeURIComponent(shareTitle());
      var target = '';
      if (type === 'threads') {
        target = 'https://www.threads.com/intent/post?text=' + text + '%20' + url;
      } else if (type === 'facebook') {
        target = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      } else if (type === 'whatsapp') {
        target = 'https://wa.me/?text=' + text + '%20' + url;
      } else if (type === 'copy') {
        copyLink(btn);
        return;
      }
      if (target) window.open(target, '_blank', 'noopener,width=640,height=560');
    });
  });

  function copyLink(btn) {
    var done = function () {
      var original = btn.innerHTML;
      var okLabel = btn.getAttribute('data-copied-label') || 'Copied';
      btn.innerHTML = okLabel;
      setTimeout(function () { btn.innerHTML = original; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl()).then(done).catch(function () { fallbackCopy(done); });
    } else {
      fallbackCopy(done);
    }
  }
  function fallbackCopy(done) {
    var ta = document.createElement('textarea');
    ta.value = shareUrl();
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }

  /* ---------- Sticky bottom share bar (article pages, mobile only) ---------- */
  function initStickyShare() {
    if (!document.querySelector('.article-content')) return;          // articles only
    if (window.sessionStorage && sessionStorage.getItem('ms_share_dismissed') === '1') return;
    if (!window.matchMedia('(max-width: 820px)').matches) return;     // mobile only

    var labels = lang === 'pt'
      ? { bar: 'Compartilhar', wa: 'WhatsApp', share: 'Compartilhar', pin: 'Salvar', x: 'Postar', close: 'Fechar', copied: 'Link copiado!' }
      : { bar: 'Compartir', wa: 'WhatsApp', share: 'Compartir', pin: 'Guardar', x: 'Publicar', close: 'Cerrar', copied: '¡Enlace copiado!' };

    var url = encodeURIComponent(shareUrl());
    var text = encodeURIComponent(shareTitle());
    var rawUrl = shareUrl();
    var rawTitle = shareTitle();

    var bar = document.createElement('div');
    bar.className = 'sticky-share';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', labels.bar);
    bar.innerHTML =
      '<span class="sticky-share-label">' + labels.bar + '</span>' +
      '<a class="ss-pill ss-wa" target="_blank" rel="noopener" aria-label="WhatsApp" href="https://wa.me/?text=' + text + '%20' + url + '">' +
        '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5z"/></svg><span>' + labels.wa + '</span></a>' +
      '<button class="ss-pill ss-share" type="button" aria-label="' + labels.share + '">' +
        '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg><span>' + labels.share + '</span></button>' +
      '<a class="ss-pill ss-pin" target="_blank" rel="noopener" aria-label="Pinterest" href="https://pinterest.com/pin/create/button/?url=' + url + '&description=' + text + '">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7c-2.2 0-3.6 1.6-3.6 3.3 0 1 .5 1.9 1.4 2.2l.4-1.4c-.3-.4-.5-.9-.5-1.3 0-1.1.9-2 2.1-2 1.1 0 1.9.7 1.9 1.7 0 1.3-.6 2.5-1.5 2.5-.5 0-.9-.4-.8-.9l.4-1.6-1.2 5h-1.5l1.9-7.5c.3-1 .1-2.5 1.9-2.5 1.5 0 2.6 1.2 2.6 2.9 0 2-1.2 3.9-3 3.9-.6 0-1.2-.3-1.4-.7"/></svg><span>Pinterest</span></a>' +
      '<a class="ss-pill ss-x" target="_blank" rel="noopener" aria-label="X" href="https://x.com/intent/post?text=' + text + '&url=' + url + '">' +
        '<svg viewBox="0 0 24 24"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.9L18.9 2z"/></svg><span>X</span></a>' +
      '<button class="ss-close" type="button" aria-label="' + labels.close + '">×</button>';

    document.body.appendChild(bar);

    bar.querySelector('.ss-close').addEventListener('click', function () {
      bar.remove();
      try { sessionStorage.setItem('ms_share_dismissed', '1'); } catch (e) {}
    });

    bar.querySelector('.ss-share').addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: rawTitle, text: rawTitle, url: rawUrl }).catch(function () {});
      } else {
        var btn = this;
        var done = function () {
          var orig = btn.innerHTML;
          btn.innerHTML = '<span>' + labels.copied + '</span>';
          setTimeout(function () { btn.innerHTML = orig; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(rawUrl).then(done).catch(function () { fallbackCopy(done); });
        } else { fallbackCopy(done); }
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyShare);
  } else {
    initStickyShare();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Newsletter (mailto-based v1) ---------- */
  var form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('newsletterEmail');
      var msg = document.getElementById('newsletterMsg');
      if (!email || !email.value || email.value.indexOf('@') < 0) {
        if (msg) msg.textContent = form.getAttribute('data-error') || 'Please enter a valid email.';
        return;
      }
      var subject = encodeURIComponent(form.getAttribute('data-subject') || 'Newsletter subscription');
      var body = encodeURIComponent('Please subscribe this email: ' + email.value);
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
      if (msg) msg.textContent = form.getAttribute('data-success') || 'Thank you! Please confirm in your email app.';
      email.value = '';
    });
  }

  /* ---------- Contact form (mailto) ---------- */
  var cform = document.getElementById('contactForm');
  if (cform) {
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cName');
      var cemail = document.getElementById('cEmail');
      var subject = document.getElementById('cSubject');
      var cmsg = document.getElementById('cMsg');
      if (!name || !name.value.trim() || !cemail || cemail.value.indexOf('@') < 0 || !cmsg || !cmsg.value.trim()) {
        if (cmsg) cmsg.focus();
        return;
      }
      var subj = encodeURIComponent('[MundoSaber] ' + (subject ? subject.value : '') + ' — ' + name.value.trim());
      var bdy = encodeURIComponent('Nombre: ' + name.value.trim() + '\nEmail: ' + cemail.value.trim() + '\n\n' + cmsg.value.trim());
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subj + '&body=' + bdy;
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

/* MundoSaber — main.js
   Language switcher links, mobile menu, share buttons, copy-link, FAQ accordion, newsletter */

(function () {
  'use strict';

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

  /* ---------- Share buttons ---------- */
  function shareUrl() { return window.location.href; }
  function shareTitle() { return document.title; }

  document.querySelectorAll('[data-share]').forEach(function (btn) {
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
      window.location.href = 'mailto:dirvesmart4201999@gmail.com?subject=' + subject + '&body=' + body;
      if (msg) msg.textContent = form.getAttribute('data-success') || 'Thank you! Please confirm in your email app.';
      email.value = '';
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

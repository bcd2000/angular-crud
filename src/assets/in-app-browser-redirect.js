(function () {
  'use strict';

  var ua = navigator.userAgent || navigator.vendor || '';

  function isInstagram() {
    return /Instagram/i.test(ua);
  }

  function isFacebookFamily() {
    return (
      /FBAN|FBAV|FB_IAB|FBIOS/i.test(ua) ||
      /Messenger/i.test(ua)
    );
  }

  function isInAppBrowser() {
    return isInstagram() || isFacebookFamily();
  }

  function isIOS() {
    return (
      /iPad|iPhone|iPod/i.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  function isAndroid() {
    return /Android/i.test(ua);
  }

  function getCurrentUrl() {
    return window.location.href;
  }

  function buildSafariUrl(url) {
    return url
      .replace(/^https:\/\//i, 'x-safari-https://')
      .replace(/^http:\/\//i, 'x-safari-http://');
  }

  function buildChromeIntentUrl(url) {
    var path = url.replace(/^https?:\/\//i, '');
    return (
      'intent://' +
      path +
      '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
      encodeURIComponent(url) +
      ';end'
    );
  }

  function openViaAnchorClick(targetUrl) {
    var link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openInNativeBrowser() {
    var url = getCurrentUrl();

    if (isIOS()) {
      var safariUrl = buildSafariUrl(url);
      window.open(safariUrl, '_blank');
      openViaAnchorClick(safariUrl);
      return;
    }

    if (isAndroid()) {
      window.location.href = buildChromeIntentUrl(url);
    }
  }

  function getAppName() {
    if (isInstagram()) return 'Instagram';
    if (/Messenger/i.test(ua)) return 'Messenger';
    return 'Facebook';
  }

  function getBrowserName() {
    return isIOS() ? 'Safari' : 'Chrome';
  }

  function showInAppBrowserPopup() {
    document.documentElement.classList.add('in-app-browser');
    if (isAndroid()) {
      document.documentElement.classList.add('android');
    }

    var title = document.getElementById('in-app-fallback-title');
    var desc = document.getElementById('in-app-fallback-desc');
    var btn = document.getElementById('open-native-browser-btn');

    if (title) {
      title.textContent = 'Mở trong ' + getBrowserName();
    }

    if (desc) {
      desc.innerHTML =
        'Bạn đang mở link từ <strong>' + getAppName() + '</strong>. ' +
        'Nhấn nút bên dưới để chuyển sang <strong>' + getBrowserName() + '</strong>, ' +
        'hoặc chọn <strong>Mở trong trình duyệt</strong> từ menu <strong>⋯</strong> của app.';
    }

    if (btn) {
      btn.textContent = 'Mở ' + getBrowserName();
      btn.addEventListener('click', openInNativeBrowser);
    }
  }

  window.__openInNativeBrowser = openInNativeBrowser;

  if (isInAppBrowser()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showInAppBrowserPopup);
    } else {
      showInAppBrowserPopup();
    }
  }
})();

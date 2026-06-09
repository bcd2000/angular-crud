(function () {
  'use strict';

  var REDIRECT_FLAG = 'external_browser_redirect_attempted';
  var ua = navigator.userAgent || navigator.vendor || '';

  function isInAppBrowser() {
    return (
      /FBAN|FBAV|FB_IAB|FBIOS/i.test(ua) ||
      /Instagram/i.test(ua) ||
      /Messenger/i.test(ua)
    );
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

  function buildNativeBrowserUrl(url) {
    if (isIOS()) {
      return url
        .replace(/^https:\/\//i, 'x-safari-https://')
        .replace(/^http:\/\//i, 'x-safari-http://');
    }

    if (isAndroid()) {
      var path = url.replace(/^https?:\/\//i, '');
      return (
        'intent://' +
        path +
        '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
        encodeURIComponent(url) +
        ';end'
      );
    }

    return url;
  }

  function showFallbackUI() {
    var overlay = document.getElementById('in-app-browser-fallback');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  }

  function redirectToNativeBrowser() {
    if (sessionStorage.getItem(REDIRECT_FLAG)) {
      showFallbackUI();
      return;
    }

    sessionStorage.setItem(REDIRECT_FLAG, '1');

    var url = getCurrentUrl();
    var nativeUrl = buildNativeBrowserUrl(url);

    window.location.replace(nativeUrl);

    setTimeout(showFallbackUI, 1500);
  }

  window.__openInNativeBrowser = function () {
    var url = getCurrentUrl();
    window.location.href = buildNativeBrowserUrl(url);
    setTimeout(showFallbackUI, 1500);
  };

  if (isInAppBrowser()) {
    redirectToNativeBrowser();
  }
})();

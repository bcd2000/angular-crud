(function () {
  'use strict';

  var REDIRECT_FLAG = 'external_browser_redirect_attempted';
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

  function buildChromeIosUrl(url) {
    return url
      .replace(/^https:\/\//i, 'googlechromes://')
      .replace(/^http:\/\//i, 'googlechrome://');
  }

  function buildNativeBrowserUrl(url) {
    if (isIOS()) {
      return buildSafariUrl(url);
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

  function openViaWindowOpen(targetUrl) {
    try {
      return window.open(targetUrl, '_blank');
    } catch (e) {
      return null;
    }
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

  function launchNativeBrowser(url) {
    if (isIOS() && isInstagram()) {
      // Instagram iOS chặn location.replace với x-safari — phải dùng window.open
      var safariUrl = buildSafariUrl(url);
      var opened = openViaWindowOpen(safariUrl);

      if (!opened) {
        openViaAnchorClick(safariUrl);
      }

      // Fallback Chrome nếu Safari scheme bị chặn (IG 417+)
      setTimeout(function () {
        openViaWindowOpen(buildChromeIosUrl(url));
      }, 400);

      return;
    }

    if (isIOS()) {
      // Facebook / Messenger: location.replace hoạt động ổn
      window.location.replace(buildSafariUrl(url));
      return;
    }

    if (isAndroid()) {
      window.location.replace(buildNativeBrowserUrl(url));
    }
  }

  function showFallbackUI() {
    var overlay = document.getElementById('in-app-browser-fallback');
    if (overlay) {
      overlay.style.display = 'flex';
    }

    var chromeBtn = document.getElementById('open-chrome-btn');
    if (chromeBtn && isIOS()) {
      chromeBtn.style.display = 'inline-block';
    }
  }

  function redirectToNativeBrowser() {
    if (sessionStorage.getItem(REDIRECT_FLAG)) {
      showFallbackUI();
      return;
    }

    sessionStorage.setItem(REDIRECT_FLAG, '1');
    launchNativeBrowser(getCurrentUrl());

    // Instagram redirect không ổn định — hiện fallback sớm hơn
    var fallbackDelay = isInstagram() ? 800 : 1500;
    setTimeout(showFallbackUI, fallbackDelay);
  }

  window.__openInNativeBrowser = function () {
    launchNativeBrowser(getCurrentUrl());
    setTimeout(showFallbackUI, 800);
  };

  window.__openInChrome = function () {
    if (isIOS()) {
      openViaWindowOpen(buildChromeIosUrl(getCurrentUrl()));
    }
    setTimeout(showFallbackUI, 800);
  };

  if (isInAppBrowser()) {
    redirectToNativeBrowser();
  }
})();

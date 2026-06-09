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

  function isInstagramIOS() {
    return isInstagram() && isIOS();
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

  function blockAppInWebview() {
    document.documentElement.classList.add('in-app-instagram-ios');
  }

  function openViaWindowOpen(targetUrl, target) {
    try {
      return window.open(targetUrl, target || '_blank');
    } catch (e) {
      return null;
    }
  }

  function openViaAnchorClick(targetUrl, target) {
    var link = document.createElement('a');
    link.href = targetUrl;
    link.target = target || '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    (document.body || document.documentElement).appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  function launchSafariFromInstagram(url, fromUserGesture) {
    var safariUrl = buildSafariUrl(url);

    // Instagram iOS: window.open (đặc biệt hiệu quả khi có user gesture)
    openViaWindowOpen(safariUrl, '_blank');

    if (fromUserGesture) {
      openViaWindowOpen(safariUrl, '_self');
      openViaAnchorClick(safariUrl, '_blank');
    }

    // Thử thêm location sau một nhịp (một số bản IG vẫn cho)
    setTimeout(function () {
      try {
        window.location.href = safariUrl;
      } catch (e) {}
    }, fromUserGesture ? 0 : 200);
  }

  function launchNativeBrowser(url, fromUserGesture) {
    if (isInstagramIOS()) {
      blockAppInWebview();
      launchSafariFromInstagram(url, fromUserGesture);
      return;
    }

    if (isIOS()) {
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

    if (isInstagramIOS()) {
      var title = document.getElementById('in-app-fallback-title');
      var desc = document.getElementById('in-app-fallback-desc');
      if (title) {
        title.textContent = 'Mở trong Safari';
      }
      if (desc) {
        desc.innerHTML =
          'Trang này không thể dùng trong Instagram. ' +
          'Nhấn <strong>Mở Safari</strong> bên dưới hoặc chọn ' +
          '<strong>Mở trong trình duyệt</strong> từ menu <strong>⋯</strong> góc trên.';
      }
    }
  }

  function redirectToNativeBrowser() {
    if (isInstagramIOS()) {
      blockAppInWebview();
      launchSafariFromInstagram(getCurrentUrl(), false);
      showFallbackUI();
      return;
    }

    if (sessionStorage.getItem(REDIRECT_FLAG)) {
      showFallbackUI();
      return;
    }

    sessionStorage.setItem(REDIRECT_FLAG, '1');
    launchNativeBrowser(getCurrentUrl(), false);

    var fallbackDelay = isInstagram() ? 800 : 1500;
    setTimeout(showFallbackUI, fallbackDelay);
  }

  window.__openInNativeBrowser = function () {
    launchNativeBrowser(getCurrentUrl(), true);
    showFallbackUI();
  };

  window.__openInChrome = function () {
    if (isIOS()) {
      openViaWindowOpen(buildChromeIosUrl(getCurrentUrl()), '_blank');
    }
    showFallbackUI();
  };

  if (isInAppBrowser()) {
    redirectToNativeBrowser();
  }
})();

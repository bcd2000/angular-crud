const REDIRECT_FLAG = 'external_browser_redirect_attempted';

export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || navigator.vendor || '';
  return (
    /FBAN|FBAV|FB_IAB|FBIOS/i.test(ua) ||
    /Instagram/i.test(ua) ||
    /Messenger/i.test(ua)
  );
}

export function isIOS(): boolean {
  const ua = navigator.userAgent || '';
  return (
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

export function buildNativeBrowserUrl(url: string): string {
  if (isIOS()) {
    return url
      .replace(/^https:\/\//i, 'x-safari-https://')
      .replace(/^http:\/\//i, 'x-safari-http://');
  }

  if (isAndroid()) {
    const path = url.replace(/^https?:\/\//i, '');
    return `intent://${path}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  }

  return url;
}

export function redirectToNativeBrowser(): void {
  if (!isInAppBrowser()) {
    return;
  }

  if (sessionStorage.getItem(REDIRECT_FLAG)) {
    return;
  }

  sessionStorage.setItem(REDIRECT_FLAG, '1');
  window.location.replace(buildNativeBrowserUrl(window.location.href));
}

const REDIRECT_FLAG = 'external_browser_redirect_attempted';

export function isInstagram(): boolean {
  return /Instagram/i.test(navigator.userAgent || navigator.vendor || '');
}

export function isFacebookFamily(): boolean {
  const ua = navigator.userAgent || navigator.vendor || '';
  return (
    /FBAN|FBAV|FB_IAB|FBIOS/i.test(ua) ||
    /Messenger/i.test(ua)
  );
}

export function isInAppBrowser(): boolean {
  return isInstagram() || isFacebookFamily();
}

export function isIOS(): boolean {
  const ua = navigator.userAgent || '';
  return (
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isInstagramIOS(): boolean {
  return isInstagram() && isIOS();
}

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

export function buildSafariUrl(url: string): string {
  return url
    .replace(/^https:\/\//i, 'x-safari-https://')
    .replace(/^http:\/\//i, 'x-safari-http://');
}

export function buildChromeIosUrl(url: string): string {
  return url
    .replace(/^https:\/\//i, 'googlechromes://')
    .replace(/^http:\/\//i, 'googlechrome://');
}

export function buildNativeBrowserUrl(url: string): string {
  if (isIOS()) {
    return buildSafariUrl(url);
  }

  if (isAndroid()) {
    const path = url.replace(/^https?:\/\//i, '');
    return `intent://${path}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  }

  return url;
}

function openViaWindowOpen(targetUrl: string, target = '_blank'): Window | null {
  try {
    return window.open(targetUrl, target);
  } catch {
    return null;
  }
}

function launchSafariFromInstagram(url: string, fromUserGesture: boolean): void {
  const safariUrl = buildSafariUrl(url);

  openViaWindowOpen(safariUrl, '_blank');

  if (fromUserGesture) {
    openViaWindowOpen(safariUrl, '_self');
    const link = document.createElement('a');
    link.href = safariUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    (document.body || document.documentElement).appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }

  setTimeout(() => {
    try {
      window.location.href = safariUrl;
    } catch {
      // Instagram có thể chặn — bỏ qua
    }
  }, fromUserGesture ? 0 : 200);
}

function launchNativeBrowser(url: string, fromUserGesture: boolean): void {
  if (isInstagramIOS()) {
    document.documentElement.classList.add('in-app-instagram-ios');
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

export function redirectToNativeBrowser(): void {
  if (!isInAppBrowser()) {
    return;
  }

  if (isInstagramIOS()) {
    launchNativeBrowser(window.location.href, false);
    return;
  }

  if (sessionStorage.getItem(REDIRECT_FLAG)) {
    return;
  }

  sessionStorage.setItem(REDIRECT_FLAG, '1');
  launchNativeBrowser(window.location.href, false);
}

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

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

export function buildSafariUrl(url: string): string {
  return url
    .replace(/^https:\/\//i, 'x-safari-https://')
    .replace(/^http:\/\//i, 'x-safari-http://');
}

export function buildChromeIntentUrl(url: string): string {
  const path = url.replace(/^https?:\/\//i, '');
  return `intent://${path}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
}

function openViaAnchorClick(targetUrl: string): void {
  const link = document.createElement('a');
  link.href = targetUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function openInNativeBrowser(): void {
  const url = window.location.href;

  if (isIOS()) {
    const safariUrl = buildSafariUrl(url);
    window.open(safariUrl, '_blank');
    openViaAnchorClick(safariUrl);
    return;
  }

  if (isAndroid()) {
    window.location.href = buildChromeIntentUrl(url);
  }
}

function getAppName(): string {
  if (isInstagram()) return 'Instagram';
  if (/Messenger/i.test(navigator.userAgent)) return 'Messenger';
  return 'Facebook';
}

function getBrowserName(): string {
  return isIOS() ? 'Safari' : 'Chrome';
}

export function showInAppBrowserPopup(): void {
  if (!isInAppBrowser()) {
    return;
  }

  document.documentElement.classList.add('in-app-browser');

  const title = document.getElementById('in-app-fallback-title');
  const desc = document.getElementById('in-app-fallback-desc');
  const btn = document.getElementById('open-native-browser-btn');

  if (title) {
    title.textContent = `Mở trong ${getBrowserName()}`;
  }

  if (desc) {
    desc.innerHTML =
      `Bạn đang mở link từ <strong>${getAppName()}</strong>. ` +
      `Nhấn nút bên dưới để chuyển sang <strong>${getBrowserName()}</strong>, ` +
      'hoặc chọn <strong>Mở trong trình duyệt</strong> từ menu <strong>⋯</strong> của app.';
  }

  if (btn) {
    btn.textContent = `Mở ${getBrowserName()}`;
  }
}

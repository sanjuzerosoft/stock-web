const IOS_STORE_URL = 'https://apps.apple.com/app/1352656275';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.stock.advisors';

const APP_STORE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 1.5c.1 1-.3 2-1 2.8-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.8-1.4zM19 17.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.7 3.1-1.4 0-1.7-.9-3.6-.9s-2.3.9-3.6.9c-1.6 0-2.8-1.6-3.6-3C.7 15.7-.2 9.2 2.4 6c1-1.3 2.5-2.1 3.9-2.1 1.5 0 2.4 1 3.7 1 1.2 0 2-1 3.7-1 1.3 0 2.6.7 3.6 1.9-3.1 1.7-2.6 6.2.7 7.5z"/></svg>';

const GOOGLE_PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 2.3 13 11.7l2.6-2.6L4.9 1.6c-.5-.3-1-.1-1.3.7zM2.6 2.9C2.5 3.1 2.4 3.4 2.4 3.8v16.4c0 .4.1.7.3.9l9.4-9.4-9.5-8.8zM17.4 9.9 14.4 12l3 3 3.3-1.9c.9-.5.9-1.6 0-2.1l-3.3-1.1zM13 12.3 3.7 21.7c.3.7.9.9 1.4.6l10.5-6-2.6-4z"/></svg>';

const STORE_ANCHOR_RE = /<a\s+class="store"\s+href="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

export function enhanceStoreButtons(html: string): string {
  return html.replace(STORE_ANCHOR_RE, (_, text: string) => {
    const label = text.trim();
    const isIOS = /app\s*store/i.test(label);
    const href = isIOS ? IOS_STORE_URL : ANDROID_STORE_URL;
    const svg = isIOS ? APP_STORE_SVG : GOOGLE_PLAY_SVG;
    const s1 = isIOS ? 'Download on the' : 'Get it on';
    const s2 = isIOS ? 'App Store' : 'Google Play';
    return `<a class="store" href="${href}" target="_blank" rel="noopener">${svg}<div style="display: flex; flex-direction: column; align-items: flex-start"><div class="s1">${s1}</div><div class="s2">${s2}</div></div></a>`;
  });
}

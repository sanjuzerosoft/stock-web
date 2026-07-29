import { injectApiIcons } from './api-content-icons';

const mailtoSpanPattern = /<span\b([^>]*\bclass\s*=\s*['"][^'"]*\bmailto-link\b[^'"]*['"][^>]*)>([\s\S]*?)<\/span>/gi;

function replaceMailtoSpans(html: string): string {
  return html.replace(mailtoSpanPattern, (_, attrString, innerText) => {
    const email = innerText.trim();
    if (!email) {
      return _;
    }

    return `<a ${attrString} href="mailto:${email}">${email}</a>`;
  });
}

/**
 * Prepares API HTML for rendering.
 * Optionally adds wrapper class on root element (used for About/Privacy/Disclosure pages).
 */
export function prepareApiContent(html: string, addInnerClass = true): string {
  if (!html?.trim()) {
    return html;
  }

  let prepared = html.trim();
  prepared = replaceMailtoSpans(prepared);

  if (addInnerClass && prepared.startsWith('<div') && !prepared.includes('api-content-inner')) {
    prepared = prepared.replace(/^<div\b/, '<div class="api-content-inner"');
  }

  return injectApiIcons(prepared);
}
const CHECK_ICON = '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function injectPricingListIcons(html: string): string {
  return html.replace(/(<li>)(?!\s*<svg)/gi, `$1${CHECK_ICON}`);
}

// const APP_STORE_SVG = '<svg viewBox="0 0 24 24"><path d="M16.5 1.5c.1 1-.3 2-1 2.8-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.8-1.4zM19 17.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.7 3.1-1.4 0-1.7-.9-3.6-.9s-2.3.9-3.6.9c-1.6 0-2.8-1.6-3.6-3C.7 15.7-.2 9.2 2.4 6c1-1.3 2.5-2.1 3.9-2.1 1.5 0 2.4 1 3.7 1 1.2 0 2-1 3.7-1 1.3 0 2.6.7 3.6 1.9-3.1 1.7-2.6 6.2.7 7.5z"/></svg>';

// // const GOOGLE_PLAY_SVG = '<svg viewBox="0 0 24 24"><path d="M3.6 2.3 13 11.7l2.6-2.6L4.9 1.6c-.5-.3-1-.1-1.3.7zM2.6 2.9C2.5 3.1 2.4 3.4 2.4 3.8v16.4c0 .4.1.7.3.9l9.4-9.4-9.5-8.8zM17.4 9.9 14.4 12l3 3 3.3-1.9c.9-.5.9-1.6 0-2.1l-3.3-1.1zM13 12.3 3.7 21.7c.3.7.9.9 1.4.6l10.5-6-2.6-4z"/></svg>';

// export function injectPricingStoreButtons(
//   html: string,
//   iosUrl: string,
//   androidUrl: string,
// ): string {
//   return html
//     .replace(
//       /<div>\s*<div class="s1">Download on the<\/div>\s*<div class="s2">App Store<\/div>\s*<\/div>/gi,
//       `<a class="store" href="${iosUrl}" target="_blank" rel="noopener">${APP_STORE_SVG}<div><div class="s1">Download on the</div><div class="s2">App Store</div></div></a>`,
//     )
//     .replace(
//       /<div>\s*<div class="s1">Get it on<\/div>\s*<div class="s2">Google Play<\/div>\s*<\/div>/gi,
//       `<a class="store" href="${androidUrl}" target="_blank" rel="noopener">${GOOGLE_PLAY_SVG}<div><div class="s1">Get it on</div><div class="s2">Google Play</div></div></a>`,
//     );
// }


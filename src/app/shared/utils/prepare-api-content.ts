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

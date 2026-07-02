import { injectApiIcons } from './api-content-icons';

/**
 * Prepares API HTML for rendering.
 * Optionally adds wrapper class on root element (used for About/Privacy/Disclosure pages).
 */
export function prepareApiContent(html: string, addInnerClass = true): string {
  if (!html?.trim()) {
    return html;
  }

  let prepared = html.trim();

  if (addInnerClass && prepared.startsWith('<div') && !prepared.includes('api-content-inner')) {
    prepared = prepared.replace(/^<div\b/, '<div class="api-content-inner"');
  }

  return injectApiIcons(prepared);
}

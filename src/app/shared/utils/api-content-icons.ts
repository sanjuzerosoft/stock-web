const SVG_ATTRS = 'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"';

const API_ICONS: Record<string, string> = {
  ICON_EMAIL: `<svg ${SVG_ATTRS} viewBox="0 0 24 24" class="api-icon api-icon--email"><path d="M3 6h18v12H3zM3 7l9 6 9-6"/></svg>`,
  ICON_CHAT: `<svg ${SVG_ATTRS} viewBox="0 0 24 24" class="api-icon api-icon--chat"><path d="M4 12a8 8 0 1116 0c0 4-3.6 7-8 7-1.2 0-2.3-.2-3.3-.6L4 20l1.2-3.2A7 7 0 014 12z"/></svg>`,
  ICON_CLOCK: `<svg ${SVG_ATTRS} viewBox="0 0 24 24" class="api-icon api-icon--clock"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  ICON_WARN: `<svg ${SVG_ATTRS} viewBox="0 0 24 24" class="api-icon api-icon--warn"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>`,
  ICON_AI: '✦',
};

export function injectApiIcons(html: string): string {
  let result = html;

  for (const [key, markup] of Object.entries(API_ICONS)) {
    result = result.replaceAll(`[${key}]`, markup);
    result = result.replaceAll(`&#91;${key}&#93;`, markup);
  }

  return result;
}

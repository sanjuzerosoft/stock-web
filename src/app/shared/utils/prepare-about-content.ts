import { prepareApiContent } from './prepare-api-content';

/**
 * About page API HTML uses a stacked identity card (company on top, platform/type below).
 * Adds a hook class so CSS can render three equal cards in one row without backend changes.
 */
export function prepareAboutContent(html: string): string {
  let prepared = prepareApiContent(html);

  prepared = prepared.replace(
    /(<!-- Identity Card -->\s*<div)(\s+style=)/i,
    '$1 class="about-identity"$2',
  );

  return prepared;
}

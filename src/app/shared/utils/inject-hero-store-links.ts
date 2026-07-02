const IOS_PLACEHOLDER = '__IOS_STORE_URL__';
const ANDROID_PLACEHOLDER = '__ANDROID_STORE_URL__';

export function injectHeroStoreLinks(
  html: string,
  iosUrl: string,
  androidUrl: string,
): string {
  return html
    .replaceAll(IOS_PLACEHOLDER, iosUrl.trim())
    .replaceAll(ANDROID_PLACEHOLDER, androidUrl.trim());
}

export { IOS_PLACEHOLDER, ANDROID_PLACEHOLDER };

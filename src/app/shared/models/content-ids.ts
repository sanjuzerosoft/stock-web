export const CONTENT_IDS = {
  about: 1,
  privacy: 2,
  disclosure: 9,
  contactReach: 21,
} as const;

/** Home page sections — viewcontent API ids (13–19 are available in DB) */
export const HOME_SECTION_IDS = {
  hero: 13,
  strategies: 14,
  features: 15,
  build: 16,
  chatter: 17,
  gallery: 18,
  pricing: 19,
} as const;

export type HomeSectionKey = keyof typeof HOME_SECTION_IDS;

/** Footer disclaimer & bottom bar — single viewcontent record */
export const FOOTER_CONTENT_ID = 20;

/** App store links — viewcontent API */
export const STORE_LINK_IDS = {
  ios: 5,
  android: 12,
} as const;

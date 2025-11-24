import { type IntlayerConfig, Locales } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.CHINESE, Locales.KOREAN, Locales.GERMAN, Locales.FRENCH],
    defaultLocale: Locales.ENGLISH,
  },
  editor: {
    enabled: process.env.NODE_ENV === "development",
  },
};

export default config;

import { defineI18nUI } from "fumadocs-ui/i18n";

import { i18n } from "@/lib/i18n";

export const { provider } = defineI18nUI(i18n, {
  translations: {
    de: {
      displayName: "Deutsch",
      search: "Dokumentation durchsuchen",
    },
    en: {
      displayName: "English",
    },
    es: {
      displayName: "Español",
      search: "Buscar en la documentación",
    },
    fr: {
      displayName: "Français",
      search: "Rechercher dans la documentation",
    },
    ja: {
      displayName: "日本語",
      search: "ドキュメントを検索",
    },
    ko: {
      displayName: "한국어",
      search: "문서 검색",
    },
    "pt-BR": {
      displayName: "Português (BR)",
      search: "Pesquisar na documentação",
    },
    ru: {
      displayName: "Русский",
      search: "Поиск в документации",
    },
    "zh-CN": {
      displayName: "中文",
      search: "搜索文档",
    },
  },
});

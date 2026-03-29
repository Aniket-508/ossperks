import type { Program } from "@ossperks/core";

import { LINK } from "@/constants/links";
import { SITE } from "@/constants/site";
import { i18n } from "@/i18n/config";
import { withLocalePrefix } from "@/i18n/navigation";
import { encodeTagForPath } from "@/lib/tag-path";

const LOCALE_TO_BCP47: Record<string, string> = {
  de: "de-DE",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  ja: "ja-JP",
  ko: "ko-KR",
  "pt-BR": "pt-BR",
  ru: "ru-RU",
  "zh-CN": "zh-Hans",
};

const JsonLdScript = ({ data }: { data: Record<string, unknown> }) => (
  <script
    // oxlint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    type="application/ld+json"
  />
);

const WebsiteJsonLd = () => {
  const inLanguage = i18n.languages.map(
    (locale: string) => LOCALE_TO_BCP47[locale] ?? locale,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: SITE.DESCRIPTION.LONG,
    inLanguage,
    name: SITE.NAME,
    url: SITE.URL,
  };

  return <JsonLdScript data={jsonLd} />;
};

const SoftwareSourceCodeJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    author: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: LINK.TWITTER,
    },
    codeRepository: LINK.GITHUB,
    description: SITE.DESCRIPTION.LONG,
    isAccessibleForFree: true,
    keywords: SITE.KEYWORDS.join(", "),
    license: LINK.LICENSE,
    name: SITE.NAME,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "USD",
    },
    programmingLanguage: ["TypeScript", "JavaScript"],
    runtimePlatform: "Node.js",
    url: SITE.URL,
  };

  return <JsonLdScript data={jsonLd} />;
};

const OrganizationJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    logo: `${SITE.URL}${SITE.OG_IMAGE}`,
    name: SITE.NAME,
    sameAs: [LINK.GITHUB, LINK.TWITTER],
    url: SITE.URL,
  };

  return <JsonLdScript data={jsonLd} />;
};

const FAQJsonLd = () => {
  const faqs = [
    {
      answer: SITE.DESCRIPTION.LONG,
      question: `What is ${SITE.NAME}?`,
    },
    {
      answer:
        "OSS Perks provides a website that aggregates open-source perks and a CLI that checks whether your project qualifies for OSS programs based on their guidelines.",
      question: `How do I use ${SITE.NAME}?`,
    },
    {
      answer: `Yes, ${SITE.NAME} is completely free and open-source under the MIT license.`,
      question: `Is ${SITE.NAME} free?`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
      name: faq.question,
    })),
  };

  return <JsonLdScript data={jsonLd} />;
};

const BreadcrumbJsonLd = ({
  items,
  lang,
}: {
  items: { name: string; path: `/${string}` }[];
  lang: string;
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: `${SITE.URL}${withLocalePrefix(lang, item.path)}`,
      name: item.name,
      position: index + 1,
    })),
  };
  return <JsonLdScript data={jsonLd} />;
};

const ProgramJsonLd = ({
  lang,
  program,
}: {
  lang: string;
  program: Program;
}) => {
  const programUrl = `${SITE.URL}${withLocalePrefix(lang, `/programs/${program.slug}`)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    applicationCategory: "DeveloperApplication",
    description: program.description,
    name: program.name,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: program.provider,
    },
    url: programUrl,
  };
  return <JsonLdScript data={jsonLd} />;
};

const ProgramListJsonLd = ({
  lang,
  programs,
}: {
  lang: string;
  programs: { name: string; slug: string }[];
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: programs.map((program, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE.URL}${withLocalePrefix(lang, `/programs/${program.slug}`)}`,
    })),
    name: "Open Source Programs",
    numberOfItems: programs.length,
  };
  return <JsonLdScript data={jsonLd} />;
};

const PersonPageJsonLd = ({
  name,
  profilePageUrl,
  role,
  sameAs,
}: {
  name: string;
  profilePageUrl?: string;
  role?: string;
  sameAs?: string;
}) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
  };
  if (role) {
    jsonLd.jobTitle = role;
  }
  if (profilePageUrl) {
    jsonLd.url = profilePageUrl;
  }
  if (sameAs) {
    jsonLd.sameAs = sameAs;
  }
  return <JsonLdScript data={jsonLd} />;
};

const CategoryProgramListJsonLd = ({
  categoryLabel,
  lang,
  pageName,
  programs,
}: {
  categoryLabel: string;
  lang: string;
  pageName: string;
  programs: { name: string; slug: string }[];
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    about: {
      "@type": "Thing",
      name: categoryLabel,
    },
    hasPart: programs.map((program) => ({
      "@type": "SoftwareApplication",
      name: program.name,
      url: `${SITE.URL}${withLocalePrefix(lang, `/programs/${program.slug}`)}`,
    })),
    name: pageName,
    numberOfItems: programs.length,
  };
  return <JsonLdScript data={jsonLd} />;
};

const CategoriesIndexItemListJsonLd = ({
  lang,
  listName,
  categories,
}: {
  lang: string;
  listName: string;
  categories: { label: string; slug: string }[];
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categories.map((row, index) => ({
      "@type": "ListItem",
      name: row.label,
      position: index + 1,
      url: `${SITE.URL}${withLocalePrefix(lang, `/categories/${row.slug}`)}`,
    })),
    name: listName,
    numberOfItems: categories.length,
  };
  return <JsonLdScript data={jsonLd} />;
};

const TagsIndexItemListJsonLd = ({
  lang,
  listName,
  tags,
}: {
  lang: string;
  listName: string;
  tags: { tag: string }[];
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tags.map((row, index) => ({
      "@type": "ListItem",
      name: row.tag,
      position: index + 1,
      url: `${SITE.URL}${withLocalePrefix(lang, `/tags/${encodeTagForPath(row.tag)}`)}`,
    })),
    name: listName,
    numberOfItems: tags.length,
  };
  return <JsonLdScript data={jsonLd} />;
};

const PeopleIndexItemListJsonLd = ({
  lang,
  listName,
  people,
}: {
  lang: string;
  listName: string;
  people: { name: string; slug: string }[];
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: people.map((row, index) => ({
      "@type": "ListItem",
      name: row.name,
      position: index + 1,
      url: `${SITE.URL}${withLocalePrefix(lang, `/people/${row.slug}`)}`,
    })),
    name: listName,
    numberOfItems: people.length,
  };
  return <JsonLdScript data={jsonLd} />;
};

const JsonLdScripts = () => (
  <>
    <WebsiteJsonLd />
    <SoftwareSourceCodeJsonLd />
    <OrganizationJsonLd />
  </>
);

export {
  JsonLdScripts,
  WebsiteJsonLd,
  SoftwareSourceCodeJsonLd,
  OrganizationJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
  ProgramJsonLd,
  ProgramListJsonLd,
  CategoryProgramListJsonLd,
  CategoriesIndexItemListJsonLd,
  TagsIndexItemListJsonLd,
  PeopleIndexItemListJsonLd,
  PersonPageJsonLd,
};

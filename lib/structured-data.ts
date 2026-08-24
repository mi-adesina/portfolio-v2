import { siteConfig } from "@/lib/site-config";

export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location,
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.x,
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

/**
 * For pages that don't already have a more specific type
 * (SoftwareApplication, Article) — About, Resume, Contact,
 * Experience, and the Projects/Blog index pages.
 */
export function webPageLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${siteConfig.url}${path}`,
  };
}

export function softwareApplicationLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: "WebApplication",
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    ...(url ? { url } : {}),
  };
}

export function articleLd({
  headline,
  description,
  datePublished,
  dateModified,
  image,
}: {
  headline: string;
  description?: string;
  datePublished?: string | null;
  dateModified: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description ? { description } : {}),
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    ...(datePublished ? { datePublished } : {}),
    dateModified,
    ...(image ? { image } : {}),
  };
}

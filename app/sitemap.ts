import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getPublishedProjects } from "@/lib/data/projects";
import { getPublishedPosts } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/experience`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/resume`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    ...(post.published_at ? { lastModified: post.published_at } : {}),
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}

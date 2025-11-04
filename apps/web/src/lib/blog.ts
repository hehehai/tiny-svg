import { allPosts } from "content-collections";
import { sortBy } from "es-toolkit";
import { Locales } from "intlayer";

export function getBlogPosts(
  locale: Locales = Locales.ENGLISH,
  order: "asc" | "desc" = "asc"
) {
  let readyPosts = sortBy(allPosts, ["createdAt"]);
  readyPosts = order === "asc" ? readyPosts : readyPosts.reverse();

  if (!locale) {
    return readyPosts;
  }

  return allPosts.filter((post) => post._meta.locale === locale);
}

export async function getBlogPost(
  slug: string,
  locale: Locales = Locales.ENGLISH
) {
  // Get all posts without locale filtering to find all versions of this slug
  const collections = allPosts.filter((blog) => blog.slug === slug);
  if (collections.length === 0) {
    return null;
  }

  // Find the post for the requested locale
  const content = collections.find((blog) => blog.locale === locale);

  if (!content) {
    return null;
  }

  return content;
}

export function getLatestBlogPosts(
  limit = 4,
  locale: Locales = Locales.ENGLISH,
  order: "asc" | "desc" = "asc"
) {
  const posts = getBlogPosts(locale, order);
  return posts.slice(0, limit);
}

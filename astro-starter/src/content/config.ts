import { defineCollection, z } from "astro:content";

/**
 * Blog collection schema. Sveltia CMS writes Markdown files into
 * src/content/blog/ whose frontmatter MUST satisfy this schema — so the CMS
 * form fields (public/admin/config.yml) and this schema are two views of the
 * same contract. Change one, change the other.
 */
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    author: z.string().default("Centre for Youth Policy"),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "tpougy",
  EMAIL: "thomazpougy@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 1,
  NUM_PROJECTS_ON_HOMEPAGE: 1,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Tpougy blog is a place to dive deep on programming, tecnology and science.",
  LANG: "en",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Articles on tech and programming.",
  LANG: "en",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "My professional experience.",
  LANG: "en",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Some explanation about projects I've worked on.",
  LANG: "en",
};

export const SOCIALS: Socials = [
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/thomaz-pougy",
  },
  {
    NAME: "github",
    HREF: "https://github.com/tpougy",
  },
];

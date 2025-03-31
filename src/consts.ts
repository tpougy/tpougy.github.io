import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "tpougy",
  EMAIL: "thomazpougy@gmail.com",
  REPO_URL: "https://github.com/tpougy/tpougy.github.io",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 1,
  NUM_PROJECTS_ON_HOMEPAGE: 1,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "A deep dive on tech stuff.",
  LANG: "en",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A deep dive on tech stuff.",
  LANG: "en",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "",
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

export type Site = {
  NAME: string;
  EMAIL: string;
  REPO_URL: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_WORKS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
  LANG: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
}[];

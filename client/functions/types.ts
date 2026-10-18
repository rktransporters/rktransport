export type PagesEnv = {
  API_BASE_URL?: string;
  COOKIE_NAME?: string;
  PAGES_DEPLOY_HOOK_URL?: string;
  REVALIDATE_SECRET?: string;
  SECRET_KEY?: string;
};

export type PagesContext = {
  request: Request;
  env: PagesEnv;
  params: Record<string, string | string[]>;
  next: () => Promise<Response>;
};

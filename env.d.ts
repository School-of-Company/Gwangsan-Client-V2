declare namespace NodeJS {
  interface ProcessEnv {
    CI?: string;
    NEXT_PUBLIC_API_URL?: string;
    PLAYWRIGHT_BASE_URL?: string;
  }
}

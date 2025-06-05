/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_URL?: string;
  readonly VITE_LOCALE?: string;
  // dodaj inne zmienne środowiskowe tutaj
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

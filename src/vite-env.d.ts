/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_DOMAIN: string;
  readonly VITE_MAKE_WEBHOOK_URL: string;
  readonly VITE_MAKE_WEBHOOK_TRIAL_URL: string;
  readonly VITE_MAKE_WEBHOOK_PT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: Element | null;
        prefill?: object;
        utm?: object;
      }) => void;
    };
  }
}

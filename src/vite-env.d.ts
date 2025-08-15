/// <reference types="vite/client" />

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

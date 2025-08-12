// Facebook Pixel utility functions
declare global {
  interface Window {
    fbq: any;
  }
}

export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

// Predefined tracking functions for common events
export const trackLead = (parameters?: any) => {
  trackEvent('Lead', parameters);
};

export const trackContact = (parameters?: any) => {
  trackEvent('Contact', parameters);
};

export const trackCompleteRegistration = (parameters?: any) => {
  trackEvent('CompleteRegistration', parameters);
};

export const trackViewContent = (parameters?: any) => {
  trackEvent('ViewContent', parameters);
};

export const trackInitiateCheckout = (parameters?: any) => {
  trackEvent('InitiateCheckout', parameters);
};
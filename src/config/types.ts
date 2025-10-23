/**
 * Multi-domain configuration types for VoxNow
 * Supports voxnow.be and voxnow.fr
 */

export type SiteDomain = 'be' | 'fr';

export interface DomainConfig {
  // Domain identification
  domain: SiteDomain;
  domainUrl: string;

  // Localization
  locale: string;
  currency: string;
  language: string;

  // Contact information
  contact: {
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };

  // Legal information
  legal: {
    companyName: string;
    vatNumber: string;
    registrationNumber: string;
  };

  // Feature flags
  features: {
    symplicyIntegration: boolean;
    calendlyUrl: string;
    blogEnabled: boolean;
  };

  // Pricing configuration
  pricing: {
    monthlyPrice: number; // in cents
    currency: string;
    trialDays: number;
  };

  // Content customization
  content: {
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
  };

  // Integration endpoints
  integrations: {
    makeWebhookUrl: string;
    makeWebhookTrialUrl: string;
    makeWebhookPtUrl: string;
  };
}
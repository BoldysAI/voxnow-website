import type { DomainConfig } from '../types';

/**
 * Belgium (voxnow.be) domain configuration
 */
export const beConfig: DomainConfig = {
  // Domain identification
  domain: 'be',
  domainUrl: 'https://voxnow.be',

  // Localization
  locale: 'fr-BE',
  currency: 'EUR',
  language: 'fr',

  // Contact information
  contact: {
    phone: '+32 493 69 08 20',
    email: 'sacha@voxnow.be',
    address: {
      street: 'Chaussée de Saint Amand 20',
      city: 'Tournai',
      postalCode: '7500',
      country: 'Belgique',
    },
  },

  // Legal information
  legal: {
    companyName: 'VoxNow Belgium',
    vatNumber: 'BE0123456789',
    registrationNumber: 'BE0123456789',
  },

  // Feature flags
  features: {
    symplicyIntegration: true,
    calendlyUrl: 'https://app.iclosed.io/e/boldysai/VoxNow-pour-avocats',
    blogEnabled: true,
  },

  // Pricing configuration
  pricing: {
    monthlyPrice: 9000, // 90 EUR in cents
    currency: 'EUR',
    trialDays: 14,
  },

  // Content customization
  content: {
    heroTitle: 'VoxNow - Votre assistant vocal intelligent',
    heroSubtitle: 'Solution complète pour les cabinets d\'avocats belges',
    ctaText: 'Commencer l\'essai gratuit',
  },

  // Integration endpoints
  integrations: {
    makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL || '',
    makeWebhookTrialUrl: import.meta.env.VITE_MAKE_WEBHOOK_TRIAL_URL || '',
    makeWebhookPtUrl: import.meta.env.VITE_MAKE_WEBHOOK_PT_URL || '',
  },
};
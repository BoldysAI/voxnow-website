import type { DomainConfig } from '../types';

/**
 * France (voxnow.fr) domain configuration
 */
export const frConfig: DomainConfig = {
  // Domain identification
  domain: 'fr',
  domainUrl: 'https://voxnow.fr',

  // Localization
  locale: 'fr-FR',
  currency: 'EUR',
  language: 'fr',

  // Contact information
  contact: {
    phone: '+32 493 69 08 20',
    email: 'sacha@voxnow.fr',
    address: {
      street: 'Chaussée de Saint Amand 20',
      city: 'Tournai',
      postalCode: '7500',
      country: 'Belgique',
    },
  },

  // Legal information
  legal: {
    companyName: 'VoxNow',
    vatNumber: 'BE0123456789',
    registrationNumber: 'BE0123456789',
  },

  // Feature flags
  features: {
    symplicyIntegration: true,
    calendlyUrl: 'https://calendly.com/hey-sachadelcourt/voxnow',
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
    heroSubtitle: 'Solution complète pour les cabinets d\'avocats français',
    ctaText: 'Commencer l\'essai gratuit',
  },

  // Integration endpoints
  integrations: {
    makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL || '',
    makeWebhookTrialUrl: import.meta.env.VITE_MAKE_WEBHOOK_TRIAL_URL || '',
    makeWebhookPtUrl: import.meta.env.VITE_MAKE_WEBHOOK_PT_URL || '',
  },
};
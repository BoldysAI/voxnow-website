import type { SiteDomain, DomainConfig } from './types';
import { beConfig } from './domains/be.config';
import { frConfig } from './domains/fr.config';
import { defaultConfig } from './domains/default.config';

/**
 * Get the current site domain from environment variable
 * @returns The site domain ('be' or 'fr')
 */
export function getSiteDomain(): SiteDomain {
  const envDomain = import.meta.env.VITE_SITE_DOMAIN;
  
  // Validate domain value
  if (envDomain !== 'be' && envDomain !== 'fr') {
    if (import.meta.env.DEV) {
      console.warn(
        `[VoxNow Config] Invalid VITE_SITE_DOMAIN value: "${envDomain}". ` +
        `Expected "be" or "fr". Falling back to "be".`
      );
    }
    return 'be';
  }
  
  return envDomain;
}

/**
 * Get the domain configuration based on the current site domain
 * @returns The domain-specific configuration
 */
export function getDomainConfig(): DomainConfig {
  const domain = getSiteDomain();
  
  switch (domain) {
    case 'be':
      return beConfig;
    case 'fr':
      return frConfig;
    default:
      if (import.meta.env.DEV) {
        console.warn(
          `[VoxNow Config] Unknown domain: "${domain}". Using default configuration.`
        );
      }
      return defaultConfig;
  }
}

/**
 * Singleton instance of the current domain configuration
 * This is the main export that should be used throughout the application
 */
export const domainConfig = getDomainConfig();

// Re-export types for convenience
export type { SiteDomain, DomainConfig } from './types';
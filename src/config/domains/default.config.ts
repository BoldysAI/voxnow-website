import { beConfig } from './be.config';
import type { DomainConfig } from '../types';

/**
 * Default domain configuration (fallback)
 * Uses Belgium configuration as the default
 */
export const defaultConfig: DomainConfig = {
  ...beConfig,
};
import { useDomainContext } from '../contexts/DomainContext';
import { DomainConfig } from '../config/types';

export function useDomainConfig(): DomainConfig {
  const { config } = useDomainContext();
  return config;
}
import { createContext, useContext, ReactNode } from 'react';
import { DomainConfig, domainConfig } from '../config';

interface DomainContextValue {
  config: DomainConfig;
}

const DomainContext = createContext<DomainContextValue | undefined>(undefined);

interface DomainProviderProps {
  children: ReactNode;
}

export function DomainProvider({ children }: DomainProviderProps) {
  const value: DomainContextValue = {
    config: domainConfig,
  };

  return (
    <DomainContext.Provider value={value}>
      {children}
    </DomainContext.Provider>
  );
}

export function useDomainContext(): DomainContextValue {
  const context = useContext(DomainContext);
  
  if (context === undefined) {
    throw new Error('useDomainContext must be used within a DomainProvider');
  }
  
  return context;
}
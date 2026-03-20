'use client';

import { createContext, useContext } from 'react';

const SiteContentContext = createContext(null);

export function SiteContentProvider({ value, children }) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

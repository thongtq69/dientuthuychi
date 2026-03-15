'use client';

import { useState } from 'react';

export function SmartImage({ src, alt, className, hideOnError = false, fallback = '' }) {
  const [error, setError] = useState(false);

  if (error && hideOnError) return null;

  return (
    <img
      src={error && fallback ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

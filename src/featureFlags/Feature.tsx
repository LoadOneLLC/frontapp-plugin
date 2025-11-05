import { type PropsWithChildren, useEffect, useState } from 'react';

import {
  FEATURE_FLAG_STORAGE_KEY,
  readFeatureFlag,
  type FeatureFlagName,
} from './store';

type FeatureProps = PropsWithChildren<{
  name: FeatureFlagName;
}>;

export const Feature = ({ name, children }: FeatureProps) => {
  const [isActive, setIsActive] = useState(() => readFeatureFlag(name));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsActive(readFeatureFlag(name));

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === FEATURE_FLAG_STORAGE_KEY) {
        setIsActive(readFeatureFlag(name));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [name]);

  if (!isActive) {
    return null;
  }

  return <>{children}</>;
};


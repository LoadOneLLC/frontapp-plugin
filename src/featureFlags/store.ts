export const FEATURE_FLAGS = {
  CustomerLink: 'CustomerLink',
} as const;

export type FeatureFlagName = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];

export const FEATURE_FLAG_STORAGE_KEY = 'feature-flags';

const FEATURE_DEFAULTS: Record<FeatureFlagName, boolean> = {
  CustomerLink: false,
};

const getStorage = () => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
  } catch (error) {
    console.warn('Feature flags: localStorage unavailable.', error);
    return null;
  }
};

export const hydrateFeatureFlags = () => {
  const storage = getStorage();
  if (!storage) {
    return { ...FEATURE_DEFAULTS };
  }

  const raw = storage.getItem(FEATURE_FLAG_STORAGE_KEY);

  if (!raw) {
    storage.setItem(FEATURE_FLAG_STORAGE_KEY, JSON.stringify(FEATURE_DEFAULTS));
    return { ...FEATURE_DEFAULTS };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Record<FeatureFlagName, boolean>>;
    const merged = { ...FEATURE_DEFAULTS, ...parsed };
    storage.setItem(FEATURE_FLAG_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.warn('Feature flags: invalid stored value, resetting to defaults.', error);
    storage.setItem(FEATURE_FLAG_STORAGE_KEY, JSON.stringify(FEATURE_DEFAULTS));
    return { ...FEATURE_DEFAULTS };
  }
};

export const readFeatureFlag = (name: FeatureFlagName) =>
  hydrateFeatureFlags()[name] ?? false;

export const initFeatureFlags = () => hydrateFeatureFlags();


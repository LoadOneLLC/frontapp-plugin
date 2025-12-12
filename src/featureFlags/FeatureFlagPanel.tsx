import { useEffect, useState } from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import {
  FEATURE_FLAGS,
  FEATURE_FLAG_LABELS,
  readFeatureFlags,
  setFeatureFlag,
  type FeatureFlagName,
} from './store';

type FlagState = Record<FeatureFlagName, boolean>;

const FLAG_NAMES = Object.values(FEATURE_FLAGS);

const FlagRow = ({
  name,
  label,
  value,
  onToggle,
}: {
  name: FeatureFlagName;
  label: string;
  value: boolean;
  onToggle: (name: FeatureFlagName, next: boolean) => void;
}) => {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300">
      <div className="text-sm font-medium text-slate-800">{label}</div>
      <input
        type="checkbox"
        className="h-4 w-4 accent-blue-600"
        checked={value}
        onChange={(event) => onToggle(name, event.target.checked)}
      />
    </label>
  );
};

export const FeatureFlagPanel = () => {
  const [flags, setFlags] = useState<FlagState>(() => readFeatureFlags());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUpdate = () => setFlags(readFeatureFlags());

    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  const handleToggle = (name: FeatureFlagName, value: boolean) => {
    const updated = setFeatureFlag(name, value);
    setFlags(updated);
  };

  return (
    <Popover className="fixed bottom-4 right-4 z-40">
      {() => (
        <>
          <PopoverButton
            type="button"
            className="text-slate-400 opacity-70 transition hover:text-slate-600 hover:opacity-100"
            aria-label="Toggle features"
          >
            <CodeBracketIcon className="h-5 w-5" />
          </PopoverButton>

          <PopoverPanel className="absolute bottom-16 right-0 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="mb-3 text-sm font-semibold text-slate-800">Features</div>
            <div className="flex flex-col gap-2">
              {FLAG_NAMES.map((flag) => (
                <FlagRow
                  key={flag}
                  name={flag}
                  label={FEATURE_FLAG_LABELS[flag] ?? flag}
                  value={Boolean(flags[flag])}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};

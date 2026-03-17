import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/shared/use-debounce';
import { tenantsApi } from '@/lib/api';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave<T extends object>(
  data: T | null,
  delay = 1500,
) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const lastSaved = useRef<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const debounced = useDebounce(data, delay);

  useEffect(() => {
    if (debounced === null) return;

    const serialized = JSON.stringify(debounced);

    // Skip first hydration
    if (lastSaved.current === null) {
      lastSaved.current = serialized;
      return;
    }

    // Skip if unchanged
    if (serialized === lastSaved.current) return;

    lastSaved.current = serialized;

    const save = async () => {
      if (!isMounted.current) return;
      setStatus('saving');
      try {
        await tenantsApi.update(debounced as Parameters<typeof tenantsApi.update>[0]);
        if (!isMounted.current) return;
        setStatus('saved');
        setTimeout(() => {
          if (isMounted.current) setStatus('idle');
        }, 2000);
      } catch {
        if (!isMounted.current) return;
        setStatus('error');
        setTimeout(() => {
          if (isMounted.current) setStatus('idle');
        }, 3000);
      }
    };

    save();
  }, [debounced]);

  return { status };
}
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProviderProfile, getProviderServices } from '../services/providerService';
import type { Provider, Service } from './types';

export const ALL_CATEGORIES = 'Todos';

type Status = 'loading' | 'ready' | 'error';

/** Categories in the order they first appear, preceded by "Todos". */
export function getCategories(services: Service[]): string[] {
  return [ALL_CATEGORIES, ...new Set(services.map(s => s.category))];
}

export function filterByCategory(services: Service[], category: string): Service[] {
  return category === ALL_CATEGORIES ? services : services.filter(s => s.category === category);
}

/** State and actions for the "Elegí un servicio" screen. */
export function useServiceSelection(providerSlug: string) {
  const [status, setStatus] = useState<Status>('loading');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProviderProfile(providerSlug), getProviderServices(providerSlug)])
      .then(([profile, list]) => {
        if (cancelled) return;
        setProvider(profile);
        setServices(list);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [providerSlug, attempt]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt(n => n + 1);
  }, []);

  const categories = useMemo(() => getCategories(services), [services]);
  const visibleServices = useMemo(() => filterByCategory(services, activeCategory), [services, activeCategory]);
  const selectedService = services.find(s => s.id === selectedServiceId) ?? null;

  return {
    status,
    provider,
    categories,
    activeCategory,
    selectCategory: setActiveCategory,
    visibleServices,
    selectedService,
    selectService: setSelectedServiceId,
    retry,
  };
}

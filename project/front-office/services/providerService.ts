import type { Provider, Service } from '../logic/types';

// Mock data until the backend exists. The async signatures match what the API calls will
// look like, so swapping this for real requests won't change the logic layer.

const PROVIDERS: Record<string, Provider> = {
  daniela: {
    slug: 'daniela',
    name: 'Daniela Ríos',
    tagline: 'Cejas, pestañas y uñas',
    area: 'Palermo, CABA',
    hoursLabel: 'Lun a vie 9–19 · Sáb 9–14',
    photoUrl: null,
  },
};

const SERVICES: Record<string, Service[]> = {
  daniela: [
    { id: 's1', name: 'Perfilado de cejas', category: 'Cejas', durationMinutes: 30, price: 9000, description: 'Diseño con pinza y cera' },
    { id: 's2', name: 'Laminado de cejas', category: 'Cejas', durationMinutes: 60, price: 18000, description: 'Incluye perfilado' },
    { id: 's3', name: 'Lifting de pestañas', category: 'Pestañas', durationMinutes: 60, price: 20000, description: 'Con tinte, dura 6 a 8 semanas' },
    { id: 's4', name: 'Extensiones clásicas', category: 'Pestañas', durationMinutes: 90, price: 32000, description: 'Pelo a pelo, primera colocación' },
    { id: 's6', name: 'Esmaltado semipermanente', category: 'Uñas', durationMinutes: 60, price: 15000, description: 'Manos, con retirado' },
    { id: 's7', name: 'Kapping gel', category: 'Uñas', durationMinutes: 90, price: 22000, description: 'Refuerzo sobre uña natural' },
    { id: 's5', name: 'Combo cejas + pestañas', category: 'Combos', durationMinutes: 120, price: 36000, description: 'Laminado y lifting' },
  ],
};

export async function getProviderProfile(slug: string): Promise<Provider> {
  const provider = PROVIDERS[slug];
  if (!provider) throw new Error(`Provider not found: ${slug}`);
  return provider;
}

export async function getProviderServices(slug: string): Promise<Service[]> {
  const services = SERVICES[slug];
  if (!services) throw new Error(`Provider not found: ${slug}`);
  return services;
}

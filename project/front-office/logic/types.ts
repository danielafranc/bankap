export interface Provider {
  slug: string;
  name: string;
  tagline: string;
  area: string;
  hoursLabel: string;
  photoUrl: string | null;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  /** Category defined by the provider (e.g. "Cejas"). */
  category: string;
  /** Minutes, always a multiple of 30 (RF-02). */
  durationMinutes: number;
  /** Price in ARS, no decimals. */
  price: number;
}

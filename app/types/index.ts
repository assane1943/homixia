export interface PrismaAppartement {
  id: number;
  code: string;
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  proprietaire: string;
  description?: string;
  lat?: number;
  lng?: number;
  wifiSsid?: string;
  wifiPassword?: string;
  keyboxCode?: string;
  keyboxPlace?: string;
  image?: string;
  createdAt?: string;
}

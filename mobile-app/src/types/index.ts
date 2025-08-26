// Types principaux de l'application
export interface ReadingSheet {
  titre: string;
  auteur: string;
  resume: string;
  plan: string;
  temporalites: string;
  pointsVue: string;
  personnages: string;
  registres: string;
  rythme: string;
  figures: string;
  procedes: string;
  lexique: string;
  citations: Citation[];
  axes: string;
  tensions: string;
  lectures: string;
  intuitions: string;
  images: string;
  fonction: string;
  references: string;
  biographie: string;
  place: string;
  courants: string;
  contexte: string;
  reception: string;
  oeuvres: string;
  thematiques: string;
  convergence: string;
  glossaire: string;
  notes: string;
  schemas: string;
}

export interface Citation {
  text: string;
  page: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textLight: string;
  border: string;
  gradient: string;
  titleFont?: string;
  textFont?: string;
  backgroundImage?: string;
  backgroundImageOpacity?: number;
}

export interface Tab {
  id: string;
  title: string;
  icon: string;
  isDefault: boolean;
  order: number;
}

export interface CustomZone {
  id: string;
  type: 'text' | 'import' | 'citation' | 'notes' | 'custom';
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isVisible: boolean;
  isDeleted: boolean;
  customStyles?: Record<string, string>;
  uploadedFiles?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    uploadDate: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
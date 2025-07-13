export interface Citation {
  text: string;
  page: string;
}

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

export interface ExportOptions {
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textLight: string;
    border: string;
    gradient: string;
  };
  pageTitle?: string;
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  data?: Blob;
  error?: string;
}
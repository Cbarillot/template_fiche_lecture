export type ZoneType = 
  | 'text'
  | 'import'
  | 'citation'
  | 'notes'
  | 'custom';

export interface ZoneTypeConfig {
  id: ZoneType;
  name: string;
  icon: string;
  description: string;
  defaultContent?: string;
  placeholderText?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  allowFileUpload?: boolean;
  allowRichText?: boolean;
  customStyles?: Record<string, string>;
}

export const ZONE_TYPE_CONFIGS: Record<ZoneType, ZoneTypeConfig> = {
  text: {
    id: 'text',
    name: 'Zone de texte',
    icon: '📝',
    description: 'Zone de texte avec éditeur complet',
    defaultContent: '',
    placeholderText: 'Saisissez votre texte ici...',
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
    textColor: '#495057',
    allowFileUpload: false,
    allowRichText: true,
    customStyles: {
      minHeight: '120px',
      padding: '15px',
      borderRadius: '8px',
      lineHeight: '1.6'
    }
  },
  import: {
    id: 'import',
    name: 'Zone d\'importation',
    icon: '📁',
    description: 'Zone pour images, documents et fichiers',
    defaultContent: '',
    placeholderText: 'Glissez-déposez vos fichiers ici ou cliquez pour sélectionner...',
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    textColor: '#1976d2',
    allowFileUpload: true,
    allowRichText: false,
    customStyles: {
      minHeight: '150px',
      padding: '20px',
      borderRadius: '12px',
      border: '2px dashed #2196f3',
      textAlign: 'center'
    }
  },
  citation: {
    id: 'citation',
    name: 'Zone de citation',
    icon: '💬',
    description: 'Zone pour citations avec formatage spécial',
    defaultContent: '',
    placeholderText: 'Saisissez votre citation ici...',
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
    textColor: '#e65100',
    allowFileUpload: false,
    allowRichText: true,
    customStyles: {
      minHeight: '100px',
      padding: '15px',
      borderRadius: '8px',
      borderLeft: '4px solid #ff9800',
      fontStyle: 'italic',
      position: 'relative'
    }
  },
  notes: {
    id: 'notes',
    name: 'Zone de notes',
    icon: '📌',
    description: 'Zone pour notes personnelles avec style différent',
    defaultContent: '',
    placeholderText: 'Ajoutez vos notes personnelles...',
    backgroundColor: '#f3e5f5',
    borderColor: '#9c27b0',
    textColor: '#4a148c',
    allowFileUpload: false,
    allowRichText: true,
    customStyles: {
      minHeight: '100px',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #9c27b0',
      fontSize: '0.9em'
    }
  },
  custom: {
    id: 'custom',
    name: 'Zone personnalisée',
    icon: '🎨',
    description: 'Zone libre avec options de personnalisation',
    defaultContent: '',
    placeholderText: 'Contenu personnalisé...',
    backgroundColor: '#ffffff',
    borderColor: '#6c757d',
    textColor: '#495057',
    allowFileUpload: true,
    allowRichText: true,
    customStyles: {
      minHeight: '120px',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #6c757d'
    }
  }
};

export interface CustomZone {
  id: string;
  type: ZoneType;
  title: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
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

export const DEFAULT_CUSTOM_ZONE: Omit<CustomZone, 'id' | 'createdAt' | 'updatedAt'> = {
  type: 'text',
  title: 'Nouvelle zone',
  content: '',
  position: { x: 50, y: 50 },
  size: { width: 300, height: 120 },
  zIndex: 1,
  isVisible: true,
  isDeleted: false,
  customStyles: {},
  uploadedFiles: []
};
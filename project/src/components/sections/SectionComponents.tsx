import React from 'react';
import { Plus, Trash2, Camera } from 'lucide-react';

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

interface SectionProps {
  sheet: ReadingSheet;
  updateField: (field: keyof ReadingSheet, value: string) => void;
  updateCitation: (index: number, field: 'text' | 'page', value: string) => void;
  addCitation: () => void;
  removeCitation: (index: number) => void;
  theme: any;
}

// Image Upload Zone Component
const ImageUploadZone = ({ label }: { label: string }) => {
  const [files, setFiles] = React.useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type === 'application/pdf') return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('text')) return '📋';
    return '📎';
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-4 transition-all duration-200 hover:border-opacity-80 cursor-pointer"
         style={{ borderColor: 'var(--primary-color, #667eea)', backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
      <input
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
        id={`file-input-${label.replace(/\s+/g, '-')}`}
      />
      <label htmlFor={`file-input-${label.replace(/\s+/g, '-')}`} className="cursor-pointer">
        <div className="text-center">
          <Camera className="mx-auto mb-2 opacity-60" size={24} />
          <p className="text-sm text-gray-600">
            📎 Cliquez pour ajouter {label}
          </p>
        </div>
      </label>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex items-center gap-2">
                <span>{getFileIcon(file)}</span>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Section 1: Résumé & Architecture
export const ResumeArchitectureSection: React.FC<SectionProps> = ({ sheet, updateField, theme }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Titre de l'œuvre
        </label>
        <input
          type="text"
          value={sheet.titre}
          onChange={(e) => updateField('titre', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Titre de l'œuvre"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Auteur·ice / Édition utilisée
        </label>
        <input
          type="text"
          value={sheet.auteur}
          onChange={(e) => updateField('auteur', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Auteur et édition"
        />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Image de couverture ou portrait d'auteur
      </label>
      <ImageUploadZone label="une image de couverture" />
    </div>

    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Résumé détaillé
      </label>
      <textarea
        value={sheet.resume}
        onChange={(e) => updateField('resume', e.target.value)}
        rows={6}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text
        }}
        placeholder="Résumé détaillé de l'œuvre..."
      />
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Plan narratif / Architecture
        </label>
        <textarea
          value={sheet.plan}
          onChange={(e) => updateField('plan', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Structure de l'œuvre..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Temporalités (ordre, vitesse, ellipses)
        </label>
        <textarea
          value={sheet.temporalites}
          onChange={(e) => updateField('temporalites', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Analyse temporelle..."
        />
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Points de vue / focalisation
        </label>
        <textarea
          value={sheet.pointsVue}
          onChange={(e) => updateField('pointsVue', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Narrateur, focalisation..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Système des personnages
        </label>
        <textarea
          value={sheet.personnages}
          onChange={(e) => updateField('personnages', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Personnages principaux..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Registres, tonalités, leitmotive
        </label>
        <textarea
          value={sheet.registres}
          onChange={(e) => updateField('registres', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Registres dominants..."
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Rythme narratif
      </label>
      <textarea
        value={sheet.rythme}
        onChange={(e) => updateField('rythme', e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text
        }}
        placeholder="Analyse du rythme..."
      />
    </div>
  </div>
);

// Section 2: Analyse stylistique
export const AnalyseStylistiqueSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  updateCitation, 
  addCitation, 
  removeCitation, 
  theme 
}) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Figures de style marquantes
        </label>
        <textarea
          value={sheet.figures}
          onChange={(e) => updateField('figures', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Métaphores, comparaisons, etc."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Procédés récurrents
        </label>
        <textarea
          value={sheet.procedes}
          onChange={(e) => updateField('procedes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Procédés stylistiques..."
        />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Lexique spécifique / glossaire
      </label>
      <textarea
        value={sheet.lexique}
        onChange={(e) => updateField('lexique', e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text
        }}
        placeholder="Vocabulaire particulier, termes techniques..."
      />
    </div>

    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-bold" style={{ color: theme.textLight }}>
          Citations clés
        </label>
        <button
          onClick={addCitation}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-white transition-all duration-200 hover:opacity-80"
          style={{ backgroundColor: theme.accent }}
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>
      <div 
        className="border-2 border-dashed p-5 rounded-lg"
        style={{ borderColor: theme.border, backgroundColor: 'white' }}
      >
        {sheet.citations.map((citation, index) => (
          <div key={index} className="flex gap-3 items-start mb-4 last:mb-0">
            <div className="flex-1">
              <input
                type="text"
                value={citation.text}
                onChange={(e) => updateCitation(index, 'text', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }}
                placeholder="« Citation importante... »"
              />
            </div>
            <div className="w-20">
              <input
                type="text"
                value={citation.page}
                onChange={(e) => updateCitation(index, 'page', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }}
                placeholder="p. 000"
              />
            </div>
            {sheet.citations.length > 1 && (
              <button
                onClick={() => removeCitation(index)}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-red-100 text-red-600"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Section 3: Problématiques & Enjeux
export const ProblematiquesEnjeuxSection: React.FC<SectionProps> = ({ sheet, updateField, theme }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Axes critiques principaux
        </label>
        <textarea
          value={sheet.axes}
          onChange={(e) => updateField('axes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Principales orientations critiques..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Tensions internes à l'œuvre
        </label>
        <textarea
          value={sheet.tensions}
          onChange={(e) => updateField('tensions', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Contradictions, ambiguïtés..."
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Lectures possibles / débats critiques
        </label>
        <textarea
          value={sheet.lectures}
          onChange={(e) => updateField('lectures', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Différentes interprétations..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Intuitions personnelles de lecture
        </label>
        <textarea
          value={sheet.intuitions}
          onChange={(e) => updateField('intuitions', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Vos réflexions personnelles..."
        />
      </div>
    </div>
  </div>
);

// Section 4: Images dans l'œuvre
export const ImagesOeuvreSection: React.FC<SectionProps> = ({ sheet, updateField, theme }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Illustrations ou références visuelles
      </label>
      <ImageUploadZone label="des images illustrant l'œuvre" />
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Origine / rôle des images
        </label>
        <textarea
          value={sheet.images}
          onChange={(e) => updateField('images', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="D'où viennent les images..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Fonction narrative ou symbolique
        </label>
        <textarea
          value={sheet.fonction}
          onChange={(e) => updateField('fonction', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Rôle dans le récit..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Références culturelles associées
        </label>
        <textarea
          value={sheet.references}
          onChange={(e) => updateField('references', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Références artistiques..."
        />
      </div>
    </div>
  </div>
);

// Section 5: Contexte & Perspectives
export const ContextePerspectivesSection: React.FC<SectionProps> = ({ sheet, updateField, theme }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Documents historiques ou contextuels
      </label>
      <ImageUploadZone label="des documents d'époque, cartes, etc." />
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Biographie de l'auteur·ice
        </label>
        <textarea
          value={sheet.biographie}
          onChange={(e) => updateField('biographie', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Éléments biographiques pertinents..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Place de l'œuvre dans son parcours
        </label>
        <textarea
          value={sheet.place}
          onChange={(e) => updateField('place', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Contexte de création..."
        />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Courants littéraires / artistiques associés
      </label>
      <textarea
        value={sheet.courants}
        onChange={(e) => updateField('courants', e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text
        }}
        placeholder="Mouvements, écoles, influences..."
      />
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Références historiques, philosophiques, critiques
        </label>
        <textarea
          value={sheet.contexte}
          onChange={(e) => updateField('contexte', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Contexte intellectuel..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Réception critique
        </label>
        <textarea
          value={sheet.reception}
          onChange={(e) => updateField('reception', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Accueil de l'œuvre..."
        />
      </div>
    </div>
  </div>
);

// Section 6: Comparatisme
export const ComparatismeSection: React.FC<SectionProps> = ({ sheet, updateField, theme }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Œuvres en regard dans le programme
      </label>
      <textarea
        value={sheet.oeuvres}
        onChange={(e) => updateField('oeuvres', e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text
        }}
        placeholder="Autres œuvres du programme..."
      />
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Thématiques ou procédés communs
        </label>
        <textarea
          value={sheet.thematiques}
          onChange={(e) => updateField('thematiques', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Points de convergence..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
          Éléments de convergence ou divergence
        </label>
        <textarea
          value={sheet.convergence}
          onChange={(e) => updateField('convergence', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
          placeholder="Similitudes et différences..."
        />
      </div>
    </div>
  </div>
);

// Section 7: Annexes
export const AnnexesSection: React.FC<SectionProps> = ({ sheet, updateField, theme }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Schémas, tableaux ou cartes mentales
      </label>
      <ImageUploadZone label="vos schémas et tableaux" />
    </div>

    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Glossaire personnel
      </label>
      <textarea
        value={sheet.glossaire}
        onChange={(e) => updateField('glossaire', e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text
        }}
        placeholder="Définitions, termes techniques..."
      />
    </div>

    <div>
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Notes ou remarques libres
      </label>
      <textarea
        value={sheet.notes}
        onChange={(e) => updateField('notes', e.target.value)}
        rows={6}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text
        }}
        placeholder="Réflexions supplémentaires, idées..."
      />
    </div>
  </div>
);
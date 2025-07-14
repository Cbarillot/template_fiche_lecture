import React from 'react';
import { Plus, Trash2, Camera } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import ZoneContainer from '../ZoneContainer';
import { ZoneCustomization } from '../../types/zoneCustomization';

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
  zoneCustomizations: { [key: string]: ZoneCustomization };
  onUpdateZoneCustomization: (zoneId: string, updates: Partial<ZoneCustomization>) => void;
  onDeleteZone: (zoneId: string) => void;
  onRestoreZone: (zoneId: string) => void;
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
export const ResumeArchitectureSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  theme, 
  zoneCustomizations, 
  onUpdateZoneCustomization, 
  onDeleteZone, 
  onRestoreZone 
}) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <ZoneContainer
        zoneId="titre"
        defaultLabel="Titre de l'œuvre"
        customization={zoneCustomizations.titre}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <input
          type="text"
          value={sheet.titre}
          onChange={(e) => updateField('titre', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
          style={{
            backgroundColor: zoneCustomizations.titre?.backgroundColor || '#ffffff',
            borderColor: theme.border,
            color: theme.text,
            opacity: 1
          }}
          placeholder="Titre de l'œuvre"
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="auteur"
        defaultLabel="Auteur·ice / Édition utilisée"
        customization={zoneCustomizations.auteur}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <input
          type="text"
          value={sheet.auteur}
          onChange={(e) => updateField('auteur', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
          style={{
            backgroundColor: zoneCustomizations.auteur?.backgroundColor || '#ffffff',
            borderColor: theme.border,
            color: theme.text,
            opacity: 1
          }}
          placeholder="Auteur et édition"
        />
      </ZoneContainer>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Image de couverture ou portrait d'auteur
      </label>
      <ImageUploadZone label="une image de couverture" />
    </div>

    <ZoneContainer
      zoneId="resume"
      defaultLabel="Résumé détaillé"
      customization={zoneCustomizations.resume}
      onUpdateCustomization={onUpdateZoneCustomization}
      onDeleteZone={onDeleteZone}
      onRestoreZone={onRestoreZone}
    >
      <RichTextEditor
        value={sheet.resume}
        onChange={(value) => updateField('resume', value)}
        placeholder="Résumé détaillé de l'œuvre..."
        theme={theme}
        rows={6}
        className="bg-white"
        style={{
          backgroundColor: zoneCustomizations.resume?.backgroundColor || '#ffffff',
          opacity: 1
        }}
      />
    </ZoneContainer>

    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <ZoneContainer
        zoneId="plan"
        defaultLabel="Plan narratif / Architecture"
        customization={zoneCustomizations.plan}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.plan}
          onChange={(value) => updateField('plan', value)}
          placeholder="Structure de l'œuvre..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.plan?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="temporalites"
        defaultLabel="Temporalités (ordre, vitesse, ellipses)"
        customization={zoneCustomizations.temporalites}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.temporalites}
          onChange={(value) => updateField('temporalites', value)}
          placeholder="Analyse temporelle..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.temporalites?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <ZoneContainer
        zoneId="pointsVue"
        defaultLabel="Points de vue / focalisation"
        customization={zoneCustomizations.pointsVue}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.pointsVue}
          onChange={(value) => updateField('pointsVue', value)}
          placeholder="Narrateur, focalisation..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.pointsVue?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="personnages"
        defaultLabel="Système des personnages"
        customization={zoneCustomizations.personnages}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.personnages}
          onChange={(value) => updateField('personnages', value)}
          placeholder="Personnages principaux..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.personnages?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="registres"
        defaultLabel="Registres, tonalités, leitmotive"
        customization={zoneCustomizations.registres}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.registres}
          onChange={(value) => updateField('registres', value)}
          placeholder="Registres dominants..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.registres?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>

    <ZoneContainer
      zoneId="rythme"
      defaultLabel="Rythme narratif"
      customization={zoneCustomizations.rythme}
      onUpdateCustomization={onUpdateZoneCustomization}
      onDeleteZone={onDeleteZone}
      onRestoreZone={onRestoreZone}
    >
      <RichTextEditor
        value={sheet.rythme}
        onChange={(value) => updateField('rythme', value)}
        placeholder="Analyse du rythme..."
        theme={theme}
        rows={3}
        style={{
          backgroundColor: zoneCustomizations.rythme?.backgroundColor || '#ffffff',
          opacity: 1
        }}
      />
    </ZoneContainer>
  </div>
);

// Section 2: Analyse stylistique
export const AnalyseStylistiqueSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  updateCitation, 
  addCitation, 
  removeCitation, 
  theme,
  zoneCustomizations,
  onUpdateZoneCustomization,
  onDeleteZone,
  onRestoreZone
}) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <ZoneContainer
        zoneId="figures"
        defaultLabel="Figures de style marquantes"
        customization={zoneCustomizations.figures}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.figures}
          onChange={(value) => updateField('figures', value)}
          placeholder="Métaphores, comparaisons, etc."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.figures?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="procedes"
        defaultLabel="Procédés récurrents"
        customization={zoneCustomizations.procedes}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.procedes}
          onChange={(value) => updateField('procedes', value)}
          placeholder="Procédés stylistiques..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.procedes?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>

    <ZoneContainer
      zoneId="lexique"
      defaultLabel="Lexique spécifique / glossaire"
      customization={zoneCustomizations.lexique}
      onUpdateCustomization={onUpdateZoneCustomization}
      onDeleteZone={onDeleteZone}
      onRestoreZone={onRestoreZone}
    >
      <RichTextEditor
        value={sheet.lexique}
        onChange={(value) => updateField('lexique', value)}
        placeholder="Vocabulaire particulier, termes techniques..."
        theme={theme}
        rows={3}
        style={{
          backgroundColor: zoneCustomizations.lexique?.backgroundColor || '#ffffff',
          opacity: 1
        }}
      />
    </ZoneContainer>

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
        style={{ borderColor: theme.border, backgroundColor: 'white', opacity: 1 }}
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
                  backgroundColor: '#ffffff',
                  borderColor: theme.border,
                  color: theme.text,
                  opacity: 1
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
                  backgroundColor: '#ffffff',
                  borderColor: theme.border,
                  color: theme.text,
                  opacity: 1
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
export const ProblematiquesEnjeuxSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  theme,
  zoneCustomizations,
  onUpdateZoneCustomization,
  onDeleteZone,
  onRestoreZone
}) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <ZoneContainer
        zoneId="axes"
        defaultLabel="Axes critiques principaux"
        customization={zoneCustomizations.axes}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.axes}
          onChange={(value) => updateField('axes', value)}
          placeholder="Principales orientations critiques..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.axes?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="tensions"
        defaultLabel="Tensions internes à l'œuvre"
        customization={zoneCustomizations.tensions}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.tensions}
          onChange={(value) => updateField('tensions', value)}
          placeholder="Contradictions, ambiguïtés..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.tensions?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <ZoneContainer
        zoneId="lectures"
        defaultLabel="Lectures possibles / débats critiques"
        customization={zoneCustomizations.lectures}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.lectures}
          onChange={(value) => updateField('lectures', value)}
          placeholder="Différentes interprétations..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.lectures?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="intuitions"
        defaultLabel="Intuitions personnelles de lecture"
        customization={zoneCustomizations.intuitions}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.intuitions}
          onChange={(value) => updateField('intuitions', value)}
          placeholder="Vos réflexions personnelles..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.intuitions?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>
  </div>
);

// Section 4: Images dans l'œuvre
export const ImagesOeuvreSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  theme,
  zoneCustomizations,
  onUpdateZoneCustomization,
  onDeleteZone,
  onRestoreZone
}) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Illustrations ou références visuelles
      </label>
      <ImageUploadZone label="des images illustrant l'œuvre" />
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <ZoneContainer
        zoneId="images"
        defaultLabel="Origine / rôle des images"
        customization={zoneCustomizations.images}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.images}
          onChange={(value) => updateField('images', value)}
          placeholder="D'où viennent les images..."
          theme={theme}
          rows={3}
          style={{
            backgroundColor: zoneCustomizations.images?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="fonction"
        defaultLabel="Fonction narrative ou symbolique"
        customization={zoneCustomizations.fonction}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.fonction}
          onChange={(value) => updateField('fonction', value)}
          placeholder="Rôle dans le récit..."
          theme={theme}
          rows={3}
          style={{
            backgroundColor: zoneCustomizations.fonction?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="references"
        defaultLabel="Références culturelles associées"
        customization={zoneCustomizations.references}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.references}
          onChange={(value) => updateField('references', value)}
          placeholder="Références artistiques..."
          theme={theme}
          rows={3}
          style={{
            backgroundColor: zoneCustomizations.references?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>
  </div>
);

// Section 5: Contexte & Perspectives
export const ContextePerspectivesSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  theme,
  zoneCustomizations,
  onUpdateZoneCustomization,
  onDeleteZone,
  onRestoreZone
}) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Documents historiques ou contextuels
      </label>
      <ImageUploadZone label="des documents d'époque, cartes, etc." />
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <ZoneContainer
        zoneId="biographie"
        defaultLabel="Biographie de l'auteur·ice"
        customization={zoneCustomizations.biographie}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.biographie}
          onChange={(value) => updateField('biographie', value)}
          placeholder="Éléments biographiques pertinents..."
          theme={theme}
          rows={3}
          style={{
            backgroundColor: zoneCustomizations.biographie?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="place"
        defaultLabel="Place de l'œuvre dans son parcours"
        customization={zoneCustomizations.place}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.place}
          onChange={(value) => updateField('place', value)}
          placeholder="Contexte de création..."
          theme={theme}
          rows={3}
          style={{
            backgroundColor: zoneCustomizations.place?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>

    <ZoneContainer
      zoneId="courants"
      defaultLabel="Courants littéraires / artistiques associés"
      customization={zoneCustomizations.courants}
      onUpdateCustomization={onUpdateZoneCustomization}
      onDeleteZone={onDeleteZone}
      onRestoreZone={onRestoreZone}
    >
      <RichTextEditor
        value={sheet.courants}
        onChange={(value) => updateField('courants', value)}
        placeholder="Mouvements, écoles, influences..."
        theme={theme}
        rows={3}
        style={{
          backgroundColor: zoneCustomizations.courants?.backgroundColor || '#ffffff',
          opacity: 1
        }}
      />
    </ZoneContainer>

    <div className="grid md:grid-cols-2 gap-6">
      <ZoneContainer
        zoneId="contexte"
        defaultLabel="Références historiques, philosophiques, critiques"
        customization={zoneCustomizations.contexte}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.contexte}
          onChange={(value) => updateField('contexte', value)}
          placeholder="Contexte intellectuel..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.contexte?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="reception"
        defaultLabel="Réception critique"
        customization={zoneCustomizations.reception}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.reception}
          onChange={(value) => updateField('reception', value)}
          placeholder="Accueil de l'œuvre..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.reception?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>
  </div>
);

// Section 6: Comparatisme
export const ComparatismeSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  theme,
  zoneCustomizations,
  onUpdateZoneCustomization,
  onDeleteZone,
  onRestoreZone
}) => (
  <div className="space-y-6">
    <ZoneContainer
      zoneId="oeuvres"
      defaultLabel="Œuvres en regard dans le programme"
      customization={zoneCustomizations.oeuvres}
      onUpdateCustomization={onUpdateZoneCustomization}
      onDeleteZone={onDeleteZone}
      onRestoreZone={onRestoreZone}
    >
      <RichTextEditor
        value={sheet.oeuvres}
        onChange={(value) => updateField('oeuvres', value)}
        placeholder="Autres œuvres du programme..."
        theme={theme}
        rows={3}
        style={{
          backgroundColor: zoneCustomizations.oeuvres?.backgroundColor || '#ffffff',
          opacity: 1
        }}
      />
    </ZoneContainer>

    <div className="grid md:grid-cols-2 gap-6">
      <ZoneContainer
        zoneId="thematiques"
        defaultLabel="Thématiques ou procédés communs"
        customization={zoneCustomizations.thematiques}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.thematiques}
          onChange={(value) => updateField('thematiques', value)}
          placeholder="Points de convergence..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.thematiques?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
      
      <ZoneContainer
        zoneId="convergence"
        defaultLabel="Éléments de convergence ou divergence"
        customization={zoneCustomizations.convergence}
        onUpdateCustomization={onUpdateZoneCustomization}
        onDeleteZone={onDeleteZone}
        onRestoreZone={onRestoreZone}
      >
        <RichTextEditor
          value={sheet.convergence}
          onChange={(value) => updateField('convergence', value)}
          placeholder="Similitudes et différences..."
          theme={theme}
          rows={4}
          style={{
            backgroundColor: zoneCustomizations.convergence?.backgroundColor || '#ffffff',
            opacity: 1
          }}
        />
      </ZoneContainer>
    </div>
  </div>
);

// Section 7: Annexes
export const AnnexesSection: React.FC<SectionProps> = ({ 
  sheet, 
  updateField, 
  theme,
  zoneCustomizations,
  onUpdateZoneCustomization,
  onDeleteZone,
  onRestoreZone
}) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
        Schémas, tableaux ou cartes mentales
      </label>
      <ImageUploadZone label="vos schémas et tableaux" />
    </div>

    <ZoneContainer
      zoneId="glossaire"
      defaultLabel="Glossaire personnel"
      customization={zoneCustomizations.glossaire}
      onUpdateCustomization={onUpdateZoneCustomization}
      onDeleteZone={onDeleteZone}
      onRestoreZone={onRestoreZone}
    >
      <RichTextEditor
        value={sheet.glossaire}
        onChange={(value) => updateField('glossaire', value)}
        placeholder="Définitions, termes techniques..."
        theme={theme}
        rows={4}
        style={{
          backgroundColor: zoneCustomizations.glossaire?.backgroundColor || '#ffffff',
          opacity: 1
        }}
      />
    </ZoneContainer>

    <ZoneContainer
      zoneId="notes"
      defaultLabel="Notes ou remarques libres"
      customization={zoneCustomizations.notes}
      onUpdateCustomization={onUpdateZoneCustomization}
      onDeleteZone={onDeleteZone}
      onRestoreZone={onRestoreZone}
    >
      <RichTextEditor
        value={sheet.notes}
        onChange={(value) => updateField('notes', value)}
        placeholder="Réflexions supplémentaires, idées..."
        theme={theme}
        rows={6}
        style={{
          backgroundColor: zoneCustomizations.notes?.backgroundColor || '#ffffff',
          opacity: 1
        }}
      />
    </ZoneContainer>
  </div>
);
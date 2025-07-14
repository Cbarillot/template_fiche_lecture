import React, { useState } from 'react';
import { Plus, ExternalLink, AlertCircle } from 'lucide-react';

interface FontSelectorProps {
  titleFont?: string;
  textFont?: string;
  onFontChange: (type: 'title' | 'text', font: string) => void;
  theme: any;
}

const STANDARD_FONTS = [
  { name: 'Système par défaut', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Palatino', value: 'Palatino, serif' },
  { name: 'Garamond', value: 'Garamond, serif' }
];

const GOOGLE_FONTS_EXAMPLES = [
  { name: 'Roboto', value: 'Roboto, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap' },
  { name: 'Lato', value: 'Lato, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap' },
  { name: 'Poppins', value: 'Poppins, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' },
  { name: 'Playfair Display', value: 'Playfair Display, serif', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap' },
  { name: 'Merriweather', value: 'Merriweather, serif', url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap' },
  { name: 'Inter', value: 'Inter, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
  { name: 'Nunito', value: 'Nunito, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap' }
];

const FontSelector: React.FC<FontSelectorProps> = ({ titleFont, textFont, onFontChange, theme }) => {
  const [showGoogleFonts, setShowGoogleFonts] = useState(false);
  const [customFontUrl, setCustomFontUrl] = useState('');
  const [customFontName, setCustomFontName] = useState('');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  const loadGoogleFont = (url: string, fontName: string) => {
    if (loadedFonts.has(fontName)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    
    setLoadedFonts(prev => new Set(prev).add(fontName));
  };

  const addCustomGoogleFont = () => {
    if (!customFontUrl.trim() || !customFontName.trim()) {
      alert('Veuillez saisir l\'URL et le nom de la police');
      return;
    }

    try {
      loadGoogleFont(customFontUrl, customFontName);
      setCustomFontUrl('');
      setCustomFontName('');
      alert('Police Google Font ajoutée avec succès !');
    } catch (error) {
      alert('Erreur lors du chargement de la police Google Font');
    }
  };

  const FontPreview = ({ font, label }: { font: string; label: string }) => (
    <div className="p-3 bg-gray-50 rounded-lg border">
      <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
      <div style={{ fontFamily: font }} className="text-lg">
        Aperçu de la police
      </div>
      <div style={{ fontFamily: font }} className="text-sm text-gray-500 mt-1">
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Font Preview */}
      <div className="grid md:grid-cols-2 gap-4">
        <FontPreview font={titleFont || 'serif'} label="Police des titres" />
        <FontPreview font={textFont || 'serif'} label="Police du texte" />
      </div>

      {/* Font Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: theme.textLight }}>
            Police des titres
          </label>
          <select
            value={titleFont || 'serif'}
            onChange={(e) => onFontChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="serif">Serif par défaut</option>
            <option value="sans-serif">Sans-serif par défaut</option>
            {STANDARD_FONTS.map((font) => (
              <option key={font.name} value={font.value}>
                {font.name}
              </option>
            ))}
            {GOOGLE_FONTS_EXAMPLES.map((font) => (
              <option key={font.name} value={font.value}>
                {font.name} (Google Font)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: theme.textLight }}>
            Police du texte
          </label>
          <select
            value={textFont || 'serif'}
            onChange={(e) => onFontChange('text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="serif">Serif par défaut</option>
            <option value="sans-serif">Sans-serif par défaut</option>
            {STANDARD_FONTS.map((font) => (
              <option key={font.name} value={font.value}>
                {font.name}
              </option>
            ))}
            {GOOGLE_FONTS_EXAMPLES.map((font) => (
              <option key={font.name} value={font.value}>
                {font.name} (Google Font)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Google Fonts Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
            <ExternalLink size={16} />
            Google Fonts
          </h4>
          <button
            onClick={() => setShowGoogleFonts(!showGoogleFonts)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showGoogleFonts ? 'Masquer' : 'Afficher les options'}
          </button>
        </div>

        {showGoogleFonts && (
          <div className="space-y-4">
            {/* Quick Load Google Fonts */}
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-900">
                Polices Google populaires
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {GOOGLE_FONTS_EXAMPLES.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => {
                      loadGoogleFont(font.url, font.name);
                      alert(`Police ${font.name} chargée !`);
                    }}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Charger {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Google Font */}
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-900">
                Importer une police Google Font personnalisée
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="URL Google Font (ex: https://fonts.googleapis.com/css2?family=...)"
                  value={customFontUrl}
                  onChange={(e) => setCustomFontUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Nom de la police (ex: Roboto, sans-serif)"
                  value={customFontName}
                  onChange={(e) => setCustomFontName(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addCustomGoogleFont}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Ajouter la police
                </button>
              </div>
            </div>

            {/* Guide */}
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Guide Google Fonts :</strong>
                  <ol className="mt-1 ml-4 list-decimal">
                    <li>Visitez <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="underline">fonts.google.com</a></li>
                    <li>Sélectionnez votre police et cliquez sur "Select this style"</li>
                    <li>Copiez l'URL du lien CSS fourni</li>
                    <li>Collez-la dans le champ URL ci-dessus</li>
                    <li>Saisissez le nom de la police (ex: "Roboto, sans-serif")</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FontSelector;
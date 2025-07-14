import React, { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Download, Upload, Check, X } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { generatePalette, isValidHex } from '../utils/colorUtils';
import { useCustomThemes, CustomTheme } from '../hooks/useCustomThemes';

interface CustomThemeCreatorProps {
  currentTheme: any;
  onThemeChange: (theme: any) => void;
  onClose: () => void;
}

const CustomThemeCreator: React.FC<CustomThemeCreatorProps> = ({ 
  currentTheme, 
  onThemeChange, 
  onClose 
}) => {
  const {
    customThemes,
    createCustomTheme,
    deleteCustomTheme,
    renameCustomTheme,
    exportCustomThemes,
    importCustomThemes,
    generateThemeName
  } = useCustomThemes();

  const [selectedColor, setSelectedColor] = useState('#667eea');
  const [themeName, setThemeName] = useState('');
  const [previewTheme, setPreviewTheme] = useState(currentTheme);
  const [editingTheme, setEditingTheme] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [hexInput, setHexInput] = useState('#667eea');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    setHexInput(color);
    
    const palette = generatePalette(color);
    if (palette) {
      setPreviewTheme(palette);
    }
  }, []);

  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      handleColorChange(value);
    }
  };

  const handleCreateTheme = () => {
    if (!themeName.trim()) {
      alert('Veuillez entrer un nom pour le thème');
      return;
    }

    const newTheme = createCustomTheme(selectedColor, themeName.trim());
    if (newTheme) {
      onThemeChange(newTheme);
      setThemeName('');
      alert('Thème créé avec succès !');
    } else {
      alert('Erreur lors de la création du thème');
    }
  };

  const handleDeleteTheme = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) {
      deleteCustomTheme(id);
    }
  };

  const handleRenameTheme = (id: string) => {
    if (editingName.trim()) {
      renameCustomTheme(id, editingName.trim());
      setEditingTheme(null);
      setEditingName('');
    }
  };

  const handleExportThemes = () => {
    const data = exportCustomThemes();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `themes-personnalises-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportThemes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          if (importCustomThemes(result)) {
            alert('Thèmes importés avec succès !');
          } else {
            alert('Erreur lors de l\'importation des thèmes');
          }
        } catch (error) {
          alert('Fichier invalide');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const ColorPreview = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <div 
        className="w-6 h-6 rounded border-2 border-gray-300"
        style={{ backgroundColor: color }}
      />
      <span className="font-medium">{label}</span>
      <span className="text-gray-500 font-mono text-xs">{color}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section 1: Créer un nouveau thème */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Plus size={20} />
          Créer un thème personnalisé
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom du thème
            </label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder={generateThemeName()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Couleur principale
              </label>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    placeholder="#667eea"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🎨
                  </button>
                </div>
                
                {showColorPicker && (
                  <div className="p-4 bg-white border border-gray-300 rounded-lg">
                    <ColorPicker
                      value={selectedColor}
                      onChange={handleColorChange}
                      size={180}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Aperçu des couleurs générées
              </label>
              <div className="space-y-2 p-3 bg-white border border-gray-300 rounded-lg">
                <ColorPreview color={previewTheme.primary} label="Principale" />
                <ColorPreview color={previewTheme.secondary} label="Secondaire" />
                <ColorPreview color={previewTheme.accent} label="Accent" />
                <ColorPreview color={previewTheme.background} label="Arrière-plan" />
                <ColorPreview color={previewTheme.border} label="Bordure" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreateTheme}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              Créer le thème
            </button>
            
            <button
              onClick={() => onThemeChange(previewTheme)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              👁️ Prévisualiser
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Thèmes personnalisés existants */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Mes thèmes personnalisés</h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportThemes}
              className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Download size={14} />
              Exporter
            </button>
            <label className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm cursor-pointer">
              <Upload size={14} />
              Importer
              <input
                type="file"
                accept=".json"
                onChange={handleImportThemes}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {customThemes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun thème personnalisé créé</p>
            <p className="text-sm">Créez votre premier thème ci-dessus</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {customThemes.map((theme) => (
              <div
                key={theme.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                    style={{ background: theme.gradient }}
                  />
                  
                  <div>
                    {editingTheme === theme.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameTheme(theme.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTheme(null);
                            setEditingName('');
                          }}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium">{theme.name}</h4>
                        <p className="text-sm text-gray-500">
                          Créé le {theme.createdAt.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onThemeChange(theme)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Utiliser
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditingTheme(theme.id);
                      setEditingName(theme.name);
                    }}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteTheme(theme.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomThemeCreator;
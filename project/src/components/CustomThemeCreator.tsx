import React, { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Download, Upload, Check, X, Palette, Type } from 'lucide-react';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
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
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts'>('colors');
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Individual color states
  const [customColors, setCustomColors] = useState({
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#8e44ad',
    background: '#f8f9fa',
    border: '#e9ecef',
    text: '#2c3e50'
  });
  
  // Font states
  const [customFonts, setCustomFonts] = useState({
    titleFont: '',
    textFont: ''
  });

  const handleColorChange = useCallback((color: string) => {
    try {
      console.log('HandleColorChange called with color:', color);
      
      // Validate color input
      if (!color || typeof color !== 'string') {
        console.error('Invalid color input:', color);
        alert('Erreur: Couleur invalide reçue');
        return;
      }
      
      // Validate hex format
      if (!isValidHex(color)) {
        console.error('Invalid hex format:', color);
        alert('Erreur: Format de couleur hexadécimal invalide');
        return;
      }
      
      setSelectedColor(color);
      setHexInput(color);
      
      if (advancedMode) {
        // In advanced mode, only update primary color
        setCustomColors(prev => ({ ...prev, primary: color }));
        updatePreviewFromCustomColors({ ...customColors, primary: color });
      } else {
        // In simple mode, generate palette from primary color
        console.log('Generating palette for color:', color);
        const palette = generatePalette(color);
        console.log('Generated palette:', palette);
        
        if (palette) {
          setPreviewTheme({
            ...palette,
            titleFont: customFonts.titleFont || palette.titleFont,
            textFont: customFonts.textFont || palette.textFont
          });
          console.log('Preview theme updated successfully');
        } else {
          console.error('Failed to generate palette for color:', color);
          alert('Erreur: Impossible de générer la palette de couleurs');
        }
      }
    } catch (error) {
      console.error('Error in handleColorChange:', error);
      alert('Erreur lors du changement de couleur. Veuillez réessayer.');
    }
  }, [advancedMode, customColors, customFonts]);

  const handleIndividualColorChange = (colorType: keyof typeof customColors, color: string) => {
    if (!isValidHex(color)) {
      alert('Format de couleur invalide');
      return;
    }
    
    const newColors = { ...customColors, [colorType]: color };
    setCustomColors(newColors);
    updatePreviewFromCustomColors(newColors);
  };

  const updatePreviewFromCustomColors = (colors: typeof customColors) => {
    const newTheme = {
      ...previewTheme,
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      border: colors.border,
      text: colors.text,
      textLight: colors.text + '99', // Add transparency
      card: '#ffffff',
      gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      titleFont: customFonts.titleFont || previewTheme.titleFont,
      textFont: customFonts.textFont || previewTheme.textFont
    };
    setPreviewTheme(newTheme);
  };

  const handleFontChange = (type: 'title' | 'text', font: string) => {
    const newFonts = { 
      ...customFonts, 
      [type === 'title' ? 'titleFont' : 'textFont']: font 
    };
    setCustomFonts(newFonts);
    
    setPreviewTheme(prev => ({
      ...prev,
      titleFont: newFonts.titleFont || prev.titleFont,
      textFont: newFonts.textFont || prev.textFont
    }));
  };

  const handleHexInputChange = (value: string) => {
    try {
      console.log('HandleHexInputChange called with value:', value);
      
      // Validate input
      if (typeof value !== 'string') {
        console.error('Invalid hex input type:', typeof value);
        return;
      }
      
      setHexInput(value);
      
      if (isValidHex(value)) {
        console.log('Valid hex detected, calling handleColorChange');
        handleColorChange(value);
      } else {
        console.log('Invalid hex format, not updating color');
      }
    } catch (error) {
      console.error('Error in handleHexInputChange:', error);
      alert('Erreur lors de la saisie de la couleur hexadécimale');
    }
  };

  const handleCreateTheme = () => {
    if (!themeName.trim()) {
      alert('Veuillez entrer un nom pour le thème');
      return;
    }

    const themeData = {
      ...previewTheme,
      name: themeName.trim(),
      titleFont: customFonts.titleFont || previewTheme.titleFont,
      textFont: customFonts.textFont || previewTheme.textFont
    };

    // Create theme using the preview theme data
    const newTheme = {
      id: Date.now().toString(),
      name: themeName.trim(),
      ...themeData,
      createdAt: new Date()
    };

    // Save to custom themes
    const updatedThemes = [...customThemes, newTheme];
    localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
    
    onThemeChange(newTheme);
    setThemeName('');
    alert('Thème créé avec succès !');
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

  const IndividualColorPicker = ({ 
    label, 
    value, 
    onChange, 
    colorKey 
  }: { 
    label: string; 
    value: string; 
    onChange: (color: string) => void; 
    colorKey: keyof typeof customColors;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="#000000"
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
        />
      </div>
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

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'colors' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Palette size={16} />
              Couleurs
            </button>
            <button
              onClick={() => setActiveTab('fonts')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'fonts' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Type size={16} />
              Polices
            </button>
          </div>

          {/* Color Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              {/* Mode Switch */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <span className="font-medium">Mode de personnalisation</span>
                  <p className="text-sm text-gray-500">
                    {advancedMode ? 'Contrôle individuel de chaque couleur' : 'Génération automatique depuis la couleur principale'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advancedMode}
                    onChange={(e) => setAdvancedMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {advancedMode ? (
                /* Advanced Mode - Individual Color Controls */
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <IndividualColorPicker
                      label="Couleur principale"
                      value={customColors.primary}
                      onChange={(color) => handleIndividualColorChange('primary', color)}
                      colorKey="primary"
                    />
                    <IndividualColorPicker
                      label="Couleur secondaire"
                      value={customColors.secondary}
                      onChange={(color) => handleIndividualColorChange('secondary', color)}
                      colorKey="secondary"
                    />
                    <IndividualColorPicker
                      label="Couleur accent"
                      value={customColors.accent}
                      onChange={(color) => handleIndividualColorChange('accent', color)}
                      colorKey="accent"
                    />
                    <IndividualColorPicker
                      label="Couleur d'arrière-plan"
                      value={customColors.background}
                      onChange={(color) => handleIndividualColorChange('background', color)}
                      colorKey="background"
                    />
                    <IndividualColorPicker
                      label="Couleur de bordure"
                      value={customColors.border}
                      onChange={(color) => handleIndividualColorChange('border', color)}
                      colorKey="border"
                    />
                    <IndividualColorPicker
                      label="Couleur des textes"
                      value={customColors.text}
                      onChange={(color) => handleIndividualColorChange('text', color)}
                      colorKey="text"
                    />
                  </div>
                </div>
              ) : (
                /* Simple Mode - Primary Color with Auto-Generation */
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
                      <ColorPreview color={previewTheme.text} label="Texte" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Font Tab */}
          {activeTab === 'fonts' && (
            <div className="space-y-4">
              <FontSelector
                titleFont={customFonts.titleFont}
                textFont={customFonts.textFont}
                onFontChange={handleFontChange}
                theme={previewTheme}
              />
            </div>
          )}

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
                        {theme.titleFont && (
                          <p className="text-xs text-gray-400">
                            Police: {theme.titleFont}
                          </p>
                        )}
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
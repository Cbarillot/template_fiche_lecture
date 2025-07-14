import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Palette, Trash2, RotateCcw, Check, X, Eye, EyeOff } from 'lucide-react';
import { ZoneCustomization } from '../types/zoneCustomization';

interface ZoneContainerProps {
  zoneId: string;
  defaultLabel: string;
  customization: ZoneCustomization;
  onUpdateCustomization: (zoneId: string, updates: Partial<ZoneCustomization>) => void;
  onDeleteZone: (zoneId: string) => void;
  onRestoreZone: (zoneId: string) => void;
  children: React.ReactNode;
  className?: string;
}

const ZoneContainer: React.FC<ZoneContainerProps> = ({
  zoneId,
  defaultLabel,
  customization,
  onUpdateCustomization,
  onDeleteZone,
  onRestoreZone,
  children,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(customization.customName || defaultLabel);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const predefinedColors = [
    '#ffffff', // White
    '#f8f9fa', // Light gray
    '#e3f2fd', // Light blue
    '#f3e5f5', // Light purple
    '#e8f5e8', // Light green
    '#fff3e0', // Light orange
    '#ffebee', // Light pink
    '#f1f8e9', // Light lime
    '#e0f2f1', // Light teal
    '#fce4ec', // Light rose
    '#e8eaf6', // Light indigo
    '#f9fbe7', // Light yellow-green
  ];

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveName = () => {
    const trimmedName = editingName.trim();
    if (trimmedName && trimmedName !== defaultLabel) {
      onUpdateCustomization(zoneId, { customName: trimmedName });
    } else {
      onUpdateCustomization(zoneId, { customName: undefined });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingName(customization.customName || defaultLabel);
    setIsEditing(false);
  };

  const handleColorChange = (color: string) => {
    onUpdateCustomization(zoneId, { backgroundColor: color });
    setShowColorPicker(false);
  };

  const handleToggleVisibility = () => {
    onUpdateCustomization(zoneId, { isVisible: !customization.isVisible });
  };

  const displayName = customization.customName || defaultLabel;

  // If zone is deleted, show restore option
  if (customization.isDeleted) {
    return (
      <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg opacity-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeOff size={16} className="text-gray-500" />
            <span className="text-gray-600 line-through">{displayName}</span>
          </div>
          <button
            onClick={() => onRestoreZone(zoneId)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="Restaurer cette zone"
          >
            <RotateCcw size={14} />
            <span className="text-sm">Restaurer</span>
          </button>
        </div>
      </div>
    );
  }

  // If zone is not visible, don't render it
  if (!customization.isVisible) {
    return null;
  }

  return (
    <div className={`mb-6 relative group ${className}`}>
      {/* Zone Header with Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm font-bold"
                style={{ color: '#6c757d' }}
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1 text-green-600 hover:text-green-800"
                title="Sauvegarder"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 text-red-600 hover:text-red-800"
                title="Annuler"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="block text-sm font-bold" style={{ color: '#6c757d' }}>
              {displayName}
            </label>
          )}
        </div>

        {/* Zone Controls */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Renommer"
          >
            <Edit2 size={14} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Changer la couleur"
            >
              <Palette size={14} />
            </button>
            
            {showColorPicker && (
              <div 
                ref={colorPickerRef}
                className="absolute top-8 right-0 z-50 bg-white border rounded-lg shadow-lg p-3"
                style={{ minWidth: '200px' }}
              >
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded border-2 hover:border-gray-400 transition-colors ${
                        customization.backgroundColor === color
                          ? 'border-gray-600 ring-2 ring-gray-300'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Couleur: ${color}`}
                    />
                  ))}
                </div>
                <div className="border-t pt-2">
                  <input
                    type="color"
                    value={customization.backgroundColor || '#ffffff'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    title="Couleur personnalisée"
                  />
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleToggleVisibility}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title={customization.isVisible ? "Masquer" : "Afficher"}
          >
            {customization.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          
          <button
            onClick={() => onDeleteZone(zoneId)}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Zone Content */}
      <div 
        className="transition-all duration-200"
        style={{ 
          backgroundColor: customization.backgroundColor || '#ffffff',
          opacity: customization.isVisible ? 1 : 0.5,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ZoneContainer;
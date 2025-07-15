import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SimpleColorPickerProps {
  onColorChange: (color: string) => void;
  onClose: () => void;
  currentColor?: string;
}

const SimpleColorPicker: React.FC<SimpleColorPickerProps> = ({
  onColorChange,
  onClose,
  currentColor = '#667eea'
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  // Predefined color palette with diverse shades
  const colorPalette = [
    // Blues
    '#667eea', '#3b82f6', '#1e40af', '#0f172a', '#0ea5e9', '#0284c7',
    // Purples
    '#764ba2', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
    // Greens
    '#27ae60', '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
    // Oranges/Reds
    '#e67e22', '#f59e0b', '#d97706', '#b45309', '#ef4444', '#dc2626',
    // Pinks
    '#e91e63', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843',
    // Grays
    '#2c3e50', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db',
    // Pastels
    '#f8bbd9', '#a8d8ea', '#b8e6b8', '#fff3cd', '#f5deb3', '#e6e6fa',
    // Additional shades
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd',
    '#87ceeb', '#f0e68c', '#ffa07a', '#98fb98', '#f5f5dc', '#d3d3d3'
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            🎨 Sélecteur de couleurs
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Color Preview */}
        <div className="mb-6 p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-inner"
              style={{ backgroundColor: selectedColor }}
            />
            <div>
              <p className="text-base font-medium text-gray-700">Couleur sélectionnée</p>
              <p className="text-sm text-gray-500 font-mono">{selectedColor}</p>
            </div>
          </div>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {colorPalette.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(color)}
              className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                selectedColor === color 
                  ? 'border-gray-800 scale-110 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ou saisir une couleur personnalisée :
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-14 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="#667eea"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onColorChange(selectedColor);
              onClose();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleColorPicker;
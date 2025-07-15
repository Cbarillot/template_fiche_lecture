import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { ZoneType, ZONE_TYPE_CONFIGS } from '../types/zoneTypes';

interface ZoneTypeDropdownProps {
  onZoneTypeSelect: (type: ZoneType, title?: string) => void;
  theme?: any;
  className?: string;
}

const ZoneTypeDropdown: React.FC<ZoneTypeDropdownProps> = ({ 
  onZoneTypeSelect, 
  theme,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ZoneType | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [showTitleInput, setShowTitleInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowTitleInput(false);
        setSelectedType(null);
        setCustomTitle('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleZoneTypeClick = (type: ZoneType) => {
    setSelectedType(type);
    setShowTitleInput(true);
    setCustomTitle(ZONE_TYPE_CONFIGS[type].name);
  };

  const handleCreateZone = () => {
    if (selectedType) {
      const finalTitle = customTitle.trim() || ZONE_TYPE_CONFIGS[selectedType].name;
      onZoneTypeSelect(selectedType, finalTitle);
      
      // Reset state
      setIsOpen(false);
      setShowTitleInput(false);
      setSelectedType(null);
      setCustomTitle('');
    }
  };

  const handleCancel = () => {
    setShowTitleInput(false);
    setSelectedType(null);
    setCustomTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateZone();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
    >
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 hover:opacity-80 shadow-lg group"
        style={{ backgroundColor: theme?.primary || '#667eea' }}
        data-testid="add-zone-button"
      >
        <Plus size={20} className="transition-transform duration-200 group-hover:rotate-90" />
        <span className="font-medium">Ajouter une zone</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Choisir un type de zone
            </h3>
            <p className="text-sm text-gray-600">
              Sélectionnez le type de zone que vous souhaitez créer
            </p>
          </div>

          {!showTitleInput ? (
            /* Zone Type Selection */
            <div className="p-2 max-h-96 overflow-y-auto">
              {Object.values(ZONE_TYPE_CONFIGS).map((config) => (
                <button
                  key={config.id}
                  onClick={() => handleZoneTypeClick(config.id)}
                  className="w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
                  data-zone-type={config.id}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200"
                      style={{ 
                        backgroundColor: config.backgroundColor,
                        border: `2px solid ${config.borderColor}20`
                      }}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 
                          className="font-medium transition-colors duration-150"
                          style={{ color: config.textColor }}
                        >
                          {config.name}
                        </h4>
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config.borderColor }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Title Input */
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ 
                      backgroundColor: selectedType ? ZONE_TYPE_CONFIGS[selectedType].backgroundColor : '#f3f4f6',
                      border: `2px solid ${selectedType ? ZONE_TYPE_CONFIGS[selectedType].borderColor : '#d1d5db'}20`
                    }}
                  >
                    {selectedType ? ZONE_TYPE_CONFIGS[selectedType].icon : '❓'}
                  </div>
                  <div>
                    <h4 
                      className="font-medium"
                      style={{ color: selectedType ? ZONE_TYPE_CONFIGS[selectedType].textColor : '#374151' }}
                    >
                      {selectedType ? ZONE_TYPE_CONFIGS[selectedType].name : ''}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Personnaliser le titre de la zone
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre de la zone
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={selectedType ? ZONE_TYPE_CONFIGS[selectedType].name : ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateZone}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Créer la zone
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Retour
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZoneTypeDropdown;
import React, { useRef, useEffect, useState } from 'react';
import { 
  MousePointer, 
  Move, 
  Grid, 
  Undo2, 
  Redo2, 
  Trash2, 
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react';
import { useCustomZones } from '../hooks/useCustomZones';
import { ZoneType } from '../types/zoneTypes';
import DraggableZone from './DraggableZone';
import ZoneTypeDropdown from './ZoneTypeDropdown';

interface CustomZoneCanvasProps {
  theme?: any;
  className?: string;
  style?: React.CSSProperties;
}

const CustomZoneCanvas: React.FC<CustomZoneCanvasProps> = ({
  theme,
  className = '',
  style = {}
}) => {
  const {
    customZones,
    selectedZoneId,
    isDragMode,
    setSelectedZoneId,
    setIsDragMode,
    createZone,
    updateZone,
    moveZone,
    resizeZone,
    deleteZone,
    restoreZone,
    duplicateZone,
    getVisibleZones,
    getDeletedZones,
    bringToFront,
    sendToBack,
    clearAllZones,
    exportZones,
    importZones
  } = useCustomZones();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showDeletedZones, setShowDeletedZones] = useState(false);

  // Grid snap settings
  const gridSize = 20;

  const handleZoneTypeSelect = (type: ZoneType, title?: string) => {
    // Calculate a good position for the new zone
    const containerRect = containerRef.current?.getBoundingClientRect();
    const existingZones = getVisibleZones();
    
    let position = { x: 50, y: 50 };
    
    if (containerRect) {
      // Try to find a position that doesn't overlap with existing zones
      let attempts = 0;
      while (attempts < 10) {
        const x = Math.random() * (containerRect.width - 300) + 50;
        const y = Math.random() * (containerRect.height - 120) + 50;
        
        // Snap to grid if enabled
        position = showGrid ? {
          x: Math.round(x / gridSize) * gridSize,
          y: Math.round(y / gridSize) * gridSize
        } : { x, y };
        
        // Check for overlaps
        const overlaps = existingZones.some(zone => 
          position.x < zone.position.x + zone.size.width &&
          position.x + 300 > zone.position.x &&
          position.y < zone.position.y + zone.size.height &&
          position.y + 120 > zone.position.y
        );
        
        if (!overlaps) break;
        attempts++;
      }
    }
    
    createZone(type, title, position);
  };

  const handleZoneMove = (zoneId: string, newPosition: { x: number; y: number }) => {
    // Snap to grid if enabled
    const snappedPosition = showGrid ? {
      x: Math.round(newPosition.x / gridSize) * gridSize,
      y: Math.round(newPosition.y / gridSize) * gridSize
    } : newPosition;
    
    moveZone(zoneId, snappedPosition);
  };

  const handleZoneResize = (zoneId: string, newSize: { width: number; height: number }) => {
    // Snap to grid if enabled
    const snappedSize = showGrid ? {
      width: Math.round(newSize.width / gridSize) * gridSize,
      height: Math.round(newSize.height / gridSize) * gridSize
    } : newSize;
    
    resizeZone(zoneId, snappedSize);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedZoneId(null);
    }
  };

  const handleImportZones = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        importZones(file);
      }
    };
    input.click();
  };

  const visibleZones = getVisibleZones();
  const deletedZones = getDeletedZones();

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          <ZoneTypeDropdown
            onZoneTypeSelect={handleZoneTypeSelect}
            theme={theme}
          />
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDragMode(!isDragMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDragMode 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={isDragMode ? 'Désactiver le mode déplacement' : 'Activer le mode déplacement'}
          >
            {isDragMode ? <Move size={16} /> : <MousePointer size={16} />}
          </button>
          
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={showGrid ? 'Masquer la grille' : 'Afficher la grille'}
          >
            <Grid size={16} />
          </button>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <div className="flex items-center gap-2">
          <button
            onClick={exportZones}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Exporter les zones"
            disabled={visibleZones.length === 0}
          >
            <Download size={16} />
          </button>
          
          <button
            onClick={handleImportZones}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Importer des zones"
          >
            <Upload size={16} />
          </button>
          
          <button
            onClick={() => setShowDeletedZones(!showDeletedZones)}
            className={`p-2 rounded-lg transition-colors ${
              showDeletedZones 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={showDeletedZones ? 'Masquer les zones supprimées' : 'Afficher les zones supprimées'}
            disabled={deletedZones.length === 0}
          >
            {showDeletedZones ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          
          <button
            onClick={clearAllZones}
            className="p-2 rounded-lg bg-gray-100 text-red-600 hover:bg-red-100 transition-colors"
            title="Supprimer toutes les zones"
            disabled={visibleZones.length === 0}
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex-1" />
        
        <div className="text-sm text-gray-600">
          {visibleZones.length} zone(s) visible(s)
          {deletedZones.length > 0 && (
            <span className="ml-2 text-red-600">
              • {deletedZones.length} supprimée(s)
            </span>
          )}
        </div>
      </div>

      {/* Zone Container */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        style={{
          minHeight: '600px',
          backgroundImage: showGrid 
            ? `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), 
               linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`
            : 'none',
          backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : 'auto',
          backgroundPosition: '0 0',
          cursor: isDragMode ? 'crosshair' : 'default'
        }}
        onClick={handleContainerClick}
      >
        {/* Visible Zones */}
        {visibleZones.map((zone) => (
          <DraggableZone
            key={zone.id}
            zone={zone}
            onUpdate={updateZone}
            onDelete={deleteZone}
            onMove={handleZoneMove}
            onResize={handleZoneResize}
            onSelect={setSelectedZoneId}
            onDuplicate={duplicateZone}
            onBringToFront={bringToFront}
            isSelected={selectedZoneId === zone.id}
            isDragMode={isDragMode}
            theme={theme}
            containerRef={containerRef}
          />
        ))}

        {/* Deleted Zones (Ghost Mode) */}
        {showDeletedZones && deletedZones.map((zone) => (
          <div
            key={`deleted-${zone.id}`}
            className="absolute border-2 border-red-300 border-dashed bg-red-50 opacity-50 rounded-lg"
            style={{
              left: zone.position.x,
              top: zone.position.y,
              width: zone.size.width,
              height: zone.size.height,
              zIndex: 0
            }}
          >
            <div className="p-2 bg-red-100 text-red-700 text-sm flex items-center justify-between">
              <span>🗑️ {zone.title} (supprimée)</span>
              <button
                onClick={() => restoreZone(zone.id)}
                className="p-1 hover:bg-red-200 rounded"
                title="Restaurer"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {visibleZones.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Aucune zone créée</h3>
              <p className="text-sm mb-4">
                Utilisez le bouton "Ajouter une zone" pour créer votre première zone personnalisée
              </p>
              <div className="text-xs text-gray-400">
                Conseil : Activez le mode déplacement pour repositionner les zones librement
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone Statistics */}
      {visibleZones.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <strong>Zones créées:</strong>
              <span className="ml-2">
                {visibleZones.filter(z => z.type === 'text').length} texte •
                {visibleZones.filter(z => z.type === 'citation').length} citations •
                {visibleZones.filter(z => z.type === 'notes').length} notes •
                {visibleZones.filter(z => z.type === 'import').length} imports •
                {visibleZones.filter(z => z.type === 'custom').length} personnalisées
              </span>
            </div>
            <div>
              Mode: {isDragMode ? 'Déplacement' : 'Édition'} • 
              Grille: {showGrid ? 'Activée' : 'Désactivée'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomZoneCanvas;
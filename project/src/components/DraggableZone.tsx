import React, { useState, useRef } from 'react';
import { 
  Edit2, 
  Trash2, 
  Move, 
  Copy, 
  Eye, 
  EyeOff, 
  Upload, 
  Download, 
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CustomZone, ZoneType, ZONE_TYPE_CONFIGS } from '../types/zoneTypes';
import { useCustomZones } from '../hooks/useCustomZones';

interface DraggableZoneProps {
  zone: CustomZone;
  onUpdate: (zoneId: string, updates: Partial<CustomZone>) => void;
  onDelete: (zoneId: string) => void;
  onMove: (zoneId: string, position: { x: number; y: number }) => void;
  onResize: (zoneId: string, size: { width: number; height: number }) => void;
  onSelect: (zoneId: string) => void;
  onDuplicate: (zoneId: string) => void;
  onBringToFront: (zoneId: string) => void;
  isSelected: boolean;
  isDragMode: boolean;
  theme?: any;
  containerRef?: React.RefObject<HTMLElement>;
}

const DraggableZone: React.FC<DraggableZoneProps> = ({
  zone,
  onUpdate,
  onDelete,
  onMove,
  onResize,
  onSelect,
  onDuplicate,
  onBringToFront,
  isSelected,
  isDragMode,
  theme,
  containerRef
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStartData, setResizeStartData] = useState({ 
    mouseX: 0, 
    mouseY: 0, 
    width: 0, 
    height: 0 
  });
  const zoneRef = useRef<HTMLDivElement>(null);

  const config = ZONE_TYPE_CONFIGS[zone.type];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragMode) return;
    
    e.stopPropagation();
    setIsDragging(true);
    onSelect(zone.id);
    onBringToFront(zone.id);
    
    const rect = zoneRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging && containerRef?.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragOffset.x;
      const newY = e.clientY - containerRect.top - dragOffset.y;
      
      // Constrain within container
      const maxX = containerRect.width - zone.size.width;
      const maxY = containerRect.height - zone.size.height;
      
      onMove(zone.id, {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStartData.mouseX;
      const deltaY = e.clientY - resizeStartData.mouseY;
      
      const newWidth = Math.max(150, resizeStartData.width + deltaX);
      const newHeight = Math.max(80, resizeStartData.height + deltaY);
      
      onResize(zone.id, {
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, dragOffset, zone.id, zone.size, containerRef, onMove, onResize, resizeStartData]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartData({
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: zone.size.width,
      height: zone.size.height
    });
  };

  const handleContentChange = (content: string) => {
    onUpdate(zone.id, { content });
  };

  const handleTitleChange = (title: string) => {
    onUpdate(zone.id, { title });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle file upload logic here
      console.log('Files to upload:', files);
    }
  };

  const renderZoneContent = () => {
    switch (zone.type) {
      case 'text':
        return (
          <div className="p-3 h-full">
            <textarea
              value={zone.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={config.placeholderText}
              className="w-full h-full resize-none border-none outline-none bg-transparent"
              style={{ 
                fontSize: '14px',
                lineHeight: '1.5',
                color: config.textColor
              }}
            />
          </div>
        );
      
      case 'import':
        return (
          <div className="p-3 h-full flex flex-col items-center justify-center">
            <input
              type="file"
              onChange={handleFileUpload}
              multiple
              className="hidden"
              id={`file-input-${zone.id}`}
            />
            <label
              htmlFor={`file-input-${zone.id}`}
              className="cursor-pointer text-center"
            >
              <Upload size={24} className="mx-auto mb-2" />
              <p className="text-sm">{config.placeholderText}</p>
            </label>
            {zone.uploadedFiles && zone.uploadedFiles.length > 0 && (
              <div className="mt-2 w-full">
                <p className="text-xs text-gray-600 mb-1">
                  {zone.uploadedFiles.length} fichier(s) uploadé(s)
                </p>
                <div className="space-y-1">
                  {zone.uploadedFiles.map((file) => (
                    <div key={file.id} className="text-xs bg-white bg-opacity-80 p-1 rounded">
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'citation':
        return (
          <div className="p-3 h-full relative">
            <div className="absolute left-1 top-1 text-2xl opacity-30">"</div>
            <textarea
              value={zone.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={config.placeholderText}
              className="w-full h-full resize-none border-none outline-none bg-transparent italic pl-6"
              style={{ 
                fontSize: '14px',
                lineHeight: '1.5',
                color: config.textColor
              }}
            />
            <div className="absolute right-1 bottom-1 text-2xl opacity-30">"</div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="p-3 h-full">
            <textarea
              value={zone.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={config.placeholderText}
              className="w-full h-full resize-none border-none outline-none bg-transparent"
              style={{ 
                fontSize: '13px',
                lineHeight: '1.4',
                color: config.textColor
              }}
            />
          </div>
        );
      
      case 'custom':
        return (
          <div className="p-3 h-full">
            <textarea
              value={zone.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={config.placeholderText}
              className="w-full h-full resize-none border-none outline-none bg-transparent"
              style={{ 
                fontSize: '14px',
                lineHeight: '1.5',
                color: config.textColor
              }}
            />
          </div>
        );
      
      default:
        return (
          <div className="p-3 h-full">
            <p className="text-gray-500 text-sm">Type de zone non supporté</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={zoneRef}
      className={`
        absolute border-2 transition-all duration-200
        ${isSelected ? 'border-blue-500 border-dashed' : 'border-transparent'}
        ${isDragMode ? 'cursor-move' : 'cursor-default'}
        ${isDragging ? 'opacity-80 shadow-lg' : ''}
        ${isResizing ? 'cursor-se-resize' : ''}
        group
      `}
      style={{
        left: zone.position.x,
        top: zone.position.y,
        width: zone.size.width,
        height: zone.size.height,
        zIndex: zone.zIndex,
        backgroundColor: config.backgroundColor,
        borderColor: isSelected ? '#3b82f6' : config.borderColor,
        borderRadius: config.customStyles?.borderRadius || '8px',
        ...config.customStyles,
        ...(zone.customStyles || {})
      }}
      onClick={() => !isDragMode && onSelect(zone.id)}
      onMouseDown={handleMouseDown}
    >
      {/* Zone Header */}
      <div 
        className={`
          flex items-center justify-between p-2 bg-black bg-opacity-5 rounded-t-lg
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          transition-opacity duration-200
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{config.icon}</span>
          {isEditing ? (
            <input
              type="text"
              value={zone.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="text-sm bg-transparent border-none outline-none"
              style={{ color: config.textColor }}
              autoFocus
            />
          ) : (
            <span 
              className="text-sm font-medium cursor-pointer"
              style={{ color: config.textColor }}
              onClick={() => setIsEditing(true)}
            >
              {zone.title}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-black hover:bg-opacity-20 rounded"
            title="Renommer"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(zone.id);
            }}
            className="p-1 hover:bg-black hover:bg-opacity-20 rounded"
            title="Dupliquer"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(zone.id);
            }}
            className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded text-red-600"
            title="Supprimer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Zone Content */}
      <div 
        className="h-full"
        style={{ 
          height: `calc(100% - ${isSelected ? '32px' : '0px'})`,
          transition: 'height 0.2s ease'
        }}
      >
        {renderZoneContent()}
      </div>

      {/* Resize Handle */}
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-70 hover:opacity-100"
          onMouseDown={handleResizeStart}
          style={{
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
          }}
        />
      )}
    </div>
  );
};

export default DraggableZone;
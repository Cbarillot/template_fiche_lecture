import { useState, useEffect } from 'react';
import { CustomZone, ZoneType, DEFAULT_CUSTOM_ZONE, ZONE_TYPE_CONFIGS } from '../types/zoneTypes';

const CUSTOM_ZONES_STORAGE_KEY = 'customZones';

export const useCustomZones = () => {
  const [customZones, setCustomZones] = useState<CustomZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isDragMode, setIsDragMode] = useState(false);

  // Load custom zones from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_ZONES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const zones = parsed.map((zone: any) => ({
          ...zone,
          createdAt: new Date(zone.createdAt),
          updatedAt: new Date(zone.updatedAt),
          uploadedFiles: zone.uploadedFiles?.map((file: any) => ({
            ...file,
            uploadDate: new Date(file.uploadDate)
          })) || []
        }));
        setCustomZones(zones);
      } catch (error) {
        console.error('Error loading custom zones:', error);
      }
    }
  }, []);

  // Save custom zones to localStorage
  useEffect(() => {
    if (customZones.length >= 0) {
      localStorage.setItem(CUSTOM_ZONES_STORAGE_KEY, JSON.stringify(customZones));
    }
  }, [customZones]);

  const createZone = (type: ZoneType, title?: string, position?: { x: number; y: number }): CustomZone => {
    const now = new Date();
    const config = ZONE_TYPE_CONFIGS[type];
    
    const newZone: CustomZone = {
      ...DEFAULT_CUSTOM_ZONE,
      id: `zone-${type}-${now.getTime()}`,
      type,
      title: title || `${config.name} ${customZones.length + 1}`,
      position: position || { 
        x: Math.random() * 200 + 50, 
        y: Math.random() * 200 + 50 
      },
      customStyles: config.customStyles || {},
      createdAt: now,
      updatedAt: now
    };

    setCustomZones(prev => [...prev, newZone]);
    setSelectedZoneId(newZone.id);
    return newZone;
  };

  const updateZone = (zoneId: string, updates: Partial<CustomZone>) => {
    setCustomZones(prev => prev.map(zone => 
      zone.id === zoneId 
        ? { ...zone, ...updates, updatedAt: new Date() }
        : zone
    ));
  };

  const moveZone = (zoneId: string, newPosition: { x: number; y: number }) => {
    updateZone(zoneId, { position: newPosition });
  };

  const resizeZone = (zoneId: string, newSize: { width: number; height: number }) => {
    updateZone(zoneId, { size: newSize });
  };

  const deleteZone = (zoneId: string) => {
    updateZone(zoneId, { isDeleted: true, isVisible: false });
  };

  const restoreZone = (zoneId: string) => {
    updateZone(zoneId, { isDeleted: false, isVisible: true });
  };

  const permanentlyDeleteZone = (zoneId: string) => {
    setCustomZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  const duplicateZone = (zoneId: string): CustomZone | null => {
    const originalZone = customZones.find(zone => zone.id === zoneId);
    if (!originalZone) return null;

    const now = new Date();
    const duplicatedZone: CustomZone = {
      ...originalZone,
      id: `zone-${originalZone.type}-${now.getTime()}`,
      title: `${originalZone.title} (copie)`,
      position: {
        x: originalZone.position.x + 20,
        y: originalZone.position.y + 20
      },
      createdAt: now,
      updatedAt: now
    };

    setCustomZones(prev => [...prev, duplicatedZone]);
    return duplicatedZone;
  };

  const getVisibleZones = () => {
    return customZones.filter(zone => zone.isVisible && !zone.isDeleted);
  };

  const getDeletedZones = () => {
    return customZones.filter(zone => zone.isDeleted);
  };

  const getZonesByType = (type: ZoneType) => {
    return customZones.filter(zone => zone.type === type && !zone.isDeleted);
  };

  const getSelectedZone = () => {
    return selectedZoneId ? customZones.find(zone => zone.id === selectedZoneId) : null;
  };

  const bringToFront = (zoneId: string) => {
    const maxZIndex = Math.max(...customZones.map(zone => zone.zIndex), 0);
    updateZone(zoneId, { zIndex: maxZIndex + 1 });
  };

  const sendToBack = (zoneId: string) => {
    const minZIndex = Math.min(...customZones.map(zone => zone.zIndex), 999);
    updateZone(zoneId, { zIndex: Math.max(0, minZIndex - 1) });
  };

  const clearAllZones = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les zones personnalisées ?')) {
      setCustomZones([]);
      setSelectedZoneId(null);
    }
  };

  const exportZones = () => {
    const dataStr = JSON.stringify(customZones, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zones-personnalisees-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importZones = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedZones = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedZones)) {
          // Validate and convert imported zones
          const validatedZones = importedZones.map((zone: any) => ({
            ...zone,
            createdAt: new Date(zone.createdAt),
            updatedAt: new Date(zone.updatedAt),
            uploadedFiles: zone.uploadedFiles?.map((file: any) => ({
              ...file,
              uploadDate: new Date(file.uploadDate)
            })) || []
          }));
          setCustomZones(prev => [...prev, ...validatedZones]);
        }
      } catch (error) {
        console.error('Error importing zones:', error);
        alert('Erreur lors de l\'importation des zones');
      }
    };
    reader.readAsText(file);
  };

  const addFileToZone = (zoneId: string, file: File) => {
    const zone = customZones.find(z => z.id === zoneId);
    if (!zone) return;

    const fileData = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadDate: new Date()
    };

    const uploadedFiles = [...(zone.uploadedFiles || []), fileData];
    updateZone(zoneId, { uploadedFiles });
  };

  const removeFileFromZone = (zoneId: string, fileId: string) => {
    const zone = customZones.find(z => z.id === zoneId);
    if (!zone) return;

    const uploadedFiles = zone.uploadedFiles?.filter(file => file.id !== fileId) || [];
    updateZone(zoneId, { uploadedFiles });
  };

  return {
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
    permanentlyDeleteZone,
    duplicateZone,
    getVisibleZones,
    getDeletedZones,
    getZonesByType,
    getSelectedZone,
    bringToFront,
    sendToBack,
    clearAllZones,
    exportZones,
    importZones,
    addFileToZone,
    removeFileFromZone
  };
};
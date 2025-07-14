import { useState, useEffect } from 'react';
import { ZoneCustomization, ZoneCustomizations, DEFAULT_ZONE_SETTINGS } from '../types/zoneCustomization';

const STORAGE_KEY = 'zoneCustomizations';

export const useZoneCustomizations = () => {
  const [customizations, setCustomizations] = useState<ZoneCustomizations>({});

  // Load customizations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomizations(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading zone customizations:', error);
      }
    }
  }, []);

  // Save customizations to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customizations));
  }, [customizations]);

  const getZoneCustomization = (zoneId: string): ZoneCustomization => {
    return customizations[zoneId] || { ...DEFAULT_ZONE_SETTINGS, id: zoneId };
  };

  const updateZoneCustomization = (zoneId: string, updates: Partial<ZoneCustomization>) => {
    setCustomizations(prev => ({
      ...prev,
      [zoneId]: {
        ...getZoneCustomization(zoneId),
        ...updates,
      }
    }));
  };

  const deleteZone = (zoneId: string) => {
    updateZoneCustomization(zoneId, { isDeleted: true, isVisible: false });
  };

  const restoreZone = (zoneId: string) => {
    updateZoneCustomization(zoneId, { isDeleted: false, isVisible: true });
  };

  const resetZoneToDefault = (zoneId: string) => {
    setCustomizations(prev => {
      const { [zoneId]: _, ...rest } = prev;
      return rest;
    });
  };

  const getVisibleZones = (zoneIds: string[]) => {
    return zoneIds.filter(zoneId => {
      const customization = getZoneCustomization(zoneId);
      return customization.isVisible && !customization.isDeleted;
    });
  };

  const getDeletedZones = (zoneIds: string[]) => {
    return zoneIds.filter(zoneId => {
      const customization = getZoneCustomization(zoneId);
      return customization.isDeleted;
    });
  };

  return {
    customizations,
    getZoneCustomization,
    updateZoneCustomization,
    deleteZone,
    restoreZone,
    resetZoneToDefault,
    getVisibleZones,
    getDeletedZones,
  };
};
export interface ZoneCustomization {
  id: string;
  customName?: string;
  backgroundColor?: string;
  isVisible?: boolean;
  isDeleted?: boolean;
}

export interface ZoneCustomizations {
  [zoneId: string]: ZoneCustomization;
}

export const DEFAULT_ZONE_SETTINGS: ZoneCustomization = {
  id: '',
  customName: undefined,
  backgroundColor: '#ffffff',
  isVisible: true,
  isDeleted: false,
};
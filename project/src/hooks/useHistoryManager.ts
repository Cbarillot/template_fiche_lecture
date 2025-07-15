import { useState, useEffect, useRef } from 'react';

export interface HistoryAction {
  id: string;
  type: 'create' | 'delete' | 'move' | 'resize' | 'content' | 'rename' | 'color' | 'restore' | 'theme' | 'customization';
  timestamp: number;
  description: string;
  target?: {
    type: 'zone' | 'sheet' | 'tab' | 'theme' | 'app';
    id: string;
  };
  before?: any;
  after?: any;
  context?: any;
}

export interface HistoryState {
  sheet?: any;
  customZones?: any[];
  tabs?: any[];
  zoneCustomizations?: any;
  theme?: any;
  customThemes?: any[];
}

const MAX_HISTORY_SIZE = 100;
const STORAGE_KEY = 'ficheHistoryStack';

export const useHistoryManager = () => {
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false);
  const stateRef = useRef<HistoryState>({});

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.history && parsed.currentIndex !== undefined) {
          setHistory(parsed.history);
          setCurrentIndex(parsed.currentIndex);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        history,
        currentIndex
      }));
    }
  }, [history, currentIndex]);

  // Capture current state for comparison
  const captureCurrentState = (): HistoryState => {
    const sheet = localStorage.getItem('ficheAnalyse');
    const customZones = localStorage.getItem('customZones');
    const tabs = localStorage.getItem('ficheAnalyseTabs');
    const zoneCustomizations = localStorage.getItem('zoneCustomizations');
    const customThemes = localStorage.getItem('customThemes');

    return {
      sheet: sheet ? JSON.parse(sheet) : null,
      customZones: customZones ? JSON.parse(customZones) : [],
      tabs: tabs ? JSON.parse(tabs) : [],
      zoneCustomizations: zoneCustomizations ? JSON.parse(zoneCustomizations) : {},
      customThemes: customThemes ? JSON.parse(customThemes) : []
    };
  };

  // Update current state reference
  const updateCurrentState = (newState: HistoryState) => {
    stateRef.current = newState;
  };

  // Add action to history
  const addToHistory = (action: Omit<HistoryAction, 'id' | 'timestamp'>) => {
    if (isUndoRedoOperation) return;

    const newAction: HistoryAction = {
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setHistory(prev => {
      // Remove any actions after current index (if we're not at the end)
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new action
      newHistory.push(newAction);
      
      // Keep history size under limit
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
      }
      
      return newHistory;
    });

    setCurrentIndex(prev => {
      const newIndex = Math.min(prev + 1, MAX_HISTORY_SIZE - 1);
      return newIndex;
    });

    console.log('Action added to history:', newAction);
    console.log('New history state:', { historyLength: history.length + 1, currentIndex: currentIndex + 1 });
  };

  // Undo operation
  const undo = () => {
    if (currentIndex < 0) return false;

    const action = history[currentIndex];
    console.log('Undoing action:', action);

    setIsUndoRedoOperation(true);

    try {
      switch (action.type) {
        case 'create':
          // Remove the created item
          if (action.target?.type === 'zone' && action.target.id) {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const filteredZones = customZones.filter((zone: any) => zone.id !== action.target!.id);
            localStorage.setItem('customZones', JSON.stringify(filteredZones));
          }
          break;

        case 'delete':
          // Restore the deleted item
          if (action.before && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const existingIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (existingIndex >= 0) {
              customZones[existingIndex] = action.before;
            } else {
              customZones.push(action.before);
            }
            localStorage.setItem('customZones', JSON.stringify(customZones));
          }
          break;

        case 'move':
        case 'resize':
          // Restore previous position/size
          if (action.before && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              if (action.type === 'move') {
                customZones[zoneIndex].position = action.before.position;
              } else {
                customZones[zoneIndex].size = action.before.size;
              }
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          }
          break;

        case 'content':
          // Restore previous content
          if (action.before && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              customZones[zoneIndex].content = action.before.content;
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          } else if (action.before && action.target?.type === 'sheet') {
            // Restore sheet field
            const sheet = JSON.parse(localStorage.getItem('ficheAnalyse') || '{}');
            if (action.target.id && action.before.hasOwnProperty('value')) {
              sheet[action.target.id] = action.before.value;
              localStorage.setItem('ficheAnalyse', JSON.stringify(sheet));
            }
          }
          break;

        case 'rename':
          // Restore previous name
          if (action.before && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              customZones[zoneIndex].title = action.before.title;
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          }
          break;

        case 'color':
          // Restore previous color
          if (action.before && action.target?.type === 'zone') {
            const zoneCustomizations = JSON.parse(localStorage.getItem('zoneCustomizations') || '{}');
            if (action.target.id) {
              zoneCustomizations[action.target.id] = {
                ...zoneCustomizations[action.target.id],
                backgroundColor: action.before.backgroundColor
              };
              localStorage.setItem('zoneCustomizations', JSON.stringify(zoneCustomizations));
            }
          }
          break;

        case 'restore':
          // Re-delete the item
          if (action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              customZones[zoneIndex].isDeleted = true;
              customZones[zoneIndex].isVisible = false;
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          }
          break;

        case 'theme':
          // Restore previous theme
          if (action.before && action.target?.type === 'app') {
            // This would need to be handled by the App component
            // We'll dispatch a custom event to notify the app
            window.dispatchEvent(new CustomEvent('theme-restore', { 
              detail: { theme: action.before.theme, customThemeData: action.before.customThemeData } 
            }));
          }
          break;

        case 'customization':
          // Restore previous customization
          if (action.before && action.target?.type === 'zone') {
            const zoneCustomizations = JSON.parse(localStorage.getItem('zoneCustomizations') || '{}');
            if (action.target.id) {
              zoneCustomizations[action.target.id] = action.before.customization;
              localStorage.setItem('zoneCustomizations', JSON.stringify(zoneCustomizations));
            }
          }
          break;
      }

      setCurrentIndex(prev => prev - 1);
      
      // Trigger storage events to update UI
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error('Error during undo:', error);
      return false;
    } finally {
      setIsUndoRedoOperation(false);
    }
  };

  // Redo operation
  const redo = () => {
    if (currentIndex >= history.length - 1) return false;

    const action = history[currentIndex + 1];
    console.log('Redoing action:', action);

    setIsUndoRedoOperation(true);

    try {
      switch (action.type) {
        case 'create':
          // Re-create the item
          if (action.after && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            customZones.push(action.after);
            localStorage.setItem('customZones', JSON.stringify(customZones));
          }
          break;

        case 'delete':
          // Re-delete the item
          if (action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              customZones[zoneIndex].isDeleted = true;
              customZones[zoneIndex].isVisible = false;
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          }
          break;

        case 'move':
        case 'resize':
          // Re-apply the change
          if (action.after && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              if (action.type === 'move') {
                customZones[zoneIndex].position = action.after.position;
              } else {
                customZones[zoneIndex].size = action.after.size;
              }
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          }
          break;

        case 'content':
          // Re-apply content change
          if (action.after && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              customZones[zoneIndex].content = action.after.content;
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          } else if (action.after && action.target?.type === 'sheet') {
            // Re-apply sheet field change
            const sheet = JSON.parse(localStorage.getItem('ficheAnalyse') || '{}');
            if (action.target.id && action.after.hasOwnProperty('value')) {
              sheet[action.target.id] = action.after.value;
              localStorage.setItem('ficheAnalyse', JSON.stringify(sheet));
            }
          }
          break;

        case 'rename':
          // Re-apply rename
          if (action.after && action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              customZones[zoneIndex].title = action.after.title;
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          }
          break;

        case 'color':
          // Re-apply color change
          if (action.after && action.target?.type === 'zone') {
            const zoneCustomizations = JSON.parse(localStorage.getItem('zoneCustomizations') || '{}');
            if (action.target.id) {
              zoneCustomizations[action.target.id] = {
                ...zoneCustomizations[action.target.id],
                backgroundColor: action.after.backgroundColor
              };
              localStorage.setItem('zoneCustomizations', JSON.stringify(zoneCustomizations));
            }
          }
          break;

        case 'restore':
          // Re-restore the item
          if (action.target?.type === 'zone') {
            const customZones = JSON.parse(localStorage.getItem('customZones') || '[]');
            const zoneIndex = customZones.findIndex((zone: any) => zone.id === action.target!.id);
            if (zoneIndex >= 0) {
              customZones[zoneIndex].isDeleted = false;
              customZones[zoneIndex].isVisible = true;
              customZones[zoneIndex].updatedAt = new Date().toISOString();
              localStorage.setItem('customZones', JSON.stringify(customZones));
            }
          }
          break;

        case 'theme':
          // Re-apply theme change
          if (action.after && action.target?.type === 'app') {
            // Dispatch custom event to notify the app
            window.dispatchEvent(new CustomEvent('theme-restore', { 
              detail: { theme: action.after.theme, customThemeData: action.after.customThemeData } 
            }));
          }
          break;

        case 'customization':
          // Re-apply customization change
          if (action.after && action.target?.type === 'zone') {
            const zoneCustomizations = JSON.parse(localStorage.getItem('zoneCustomizations') || '{}');
            if (action.target.id) {
              zoneCustomizations[action.target.id] = action.after.customization;
              localStorage.setItem('zoneCustomizations', JSON.stringify(zoneCustomizations));
            }
          }
          break;
      }

      setCurrentIndex(prev => prev + 1);
      
      // Trigger storage events to update UI
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error('Error during redo:', error);
      return false;
    } finally {
      setIsUndoRedoOperation(false);
    }
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    setCurrentIndex(-1);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Get history summary
  const getHistorySummary = () => {
    const actionCounts = history.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: history.length,
      currentIndex,
      canUndo: currentIndex >= 0,
      canRedo: currentIndex < history.length - 1,
      actionCounts
    };
  };

  return {
    history,
    currentIndex,
    addToHistory,
    undo,
    redo,
    clearHistory,
    getHistorySummary,
    captureCurrentState,
    updateCurrentState,
    isUndoRedoOperation
  };
};
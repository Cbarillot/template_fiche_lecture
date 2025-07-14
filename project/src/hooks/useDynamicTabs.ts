import { useState, useEffect } from 'react';
import { Tab } from '../components/TabManager';

export interface TabData {
  id: string;
  title: string;
  icon: string;
  isDefault: boolean;
  order: number;
}

const DEFAULT_TABS: TabData[] = [
  {
    id: 'resume-architecture',
    title: 'Résumé & Architecture',
    icon: '📘',
    isDefault: true,
    order: 1
  },
  {
    id: 'analyse-stylistique',
    title: 'Analyse stylistique',
    icon: '🖋️',
    isDefault: true,
    order: 2
  },
  {
    id: 'problematiques-enjeux',
    title: 'Problématiques & Enjeux',
    icon: '🧠',
    isDefault: true,
    order: 3
  },
  {
    id: 'images-oeuvre',
    title: 'Images dans l\'œuvre',
    icon: '🖼️',
    isDefault: true,
    order: 4
  },
  {
    id: 'contexte-perspectives',
    title: 'Contexte & Perspectives',
    icon: '🔍',
    isDefault: true,
    order: 5
  },
  {
    id: 'comparatisme',
    title: 'Comparatisme',
    icon: '🔄',
    isDefault: true,
    order: 6
  },
  {
    id: 'annexes',
    title: 'Annexes',
    icon: '📂',
    isDefault: true,
    order: 7
  },
  {
    id: 'custom-zones-main',
    title: 'Zones personnalisées',
    icon: '🎨',
    isDefault: true,
    order: 8
  }
];

const TABS_STORAGE_KEY = 'ficheAnalyseTabs';

export const useDynamicTabs = () => {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');

  // Load tabs from localStorage on mount
  useEffect(() => {
    const savedTabs = localStorage.getItem(TABS_STORAGE_KEY);
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        if (parsedTabs.length > 0) {
          setTabs(parsedTabs);
          setActiveTab(parsedTabs[0].id);
        } else {
          initializeDefaultTabs();
        }
      } catch (error) {
        console.error('Error loading tabs:', error);
        initializeDefaultTabs();
      }
    } else {
      initializeDefaultTabs();
    }
  }, []);

  // Save tabs to localStorage whenever tabs change
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
    }
  }, [tabs]);

  const initializeDefaultTabs = () => {
    setTabs(DEFAULT_TABS);
    setActiveTab(DEFAULT_TABS[0].id);
  };

  const addTab = (title: string, icon: string = '📝') => {
    const newTab: TabData = {
      id: `tab-${Date.now()}`,
      title,
      icon,
      isDefault: false,
      order: tabs.length + 1
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
    return newTab;
  };

  const deleteTab = (tabId: string) => {
    const tabToDelete = tabs.find(tab => tab.id === tabId);
    if (tabToDelete?.isDefault) {
      return false; // Cannot delete default tabs
    }

    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      // If we're deleting the active tab, switch to the first available tab
      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[0].id);
      }
      return newTabs;
    });
    return true;
  };

  const updateTab = (tabId: string, updates: Partial<TabData>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, ...updates }
        : tab
    ));
  };

  const reorderTabs = (oldIndex: number, newIndex: number) => {
    setTabs(prev => {
      const newTabs = [...prev];
      const [movedTab] = newTabs.splice(oldIndex, 1);
      newTabs.splice(newIndex, 0, movedTab);
      
      // Update order numbers
      return newTabs.map((tab, index) => ({
        ...tab,
        order: index + 1
      }));
    });
  };

  const getActiveTabData = () => {
    return tabs.find(tab => tab.id === activeTab);
  };

  const resetToDefault = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les onglets ?')) {
      initializeDefaultTabs();
    }
  };

  return {
    tabs,
    activeTab,
    setActiveTab,
    addTab,
    deleteTab,
    updateTab,
    reorderTabs,
    getActiveTabData,
    resetToDefault
  };
};
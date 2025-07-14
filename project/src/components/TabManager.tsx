import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical, Edit2, Check } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDynamicTabs } from '../hooks/useDynamicTabs';
import {
  ReadingSheet,
  ResumeArchitectureSection,
  AnalyseStylistiqueSection,
  ProblematiquesEnjeuxSection,
  ImagesOeuvreSection,
  ContextePerspectivesSection,
  ComparatismeSection,
  AnnexesSection
} from './sections/SectionComponents';

export interface Tab {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  isDefault: boolean;
}

interface TabManagerProps {
  onTabsChange?: (tabs: Tab[]) => void;
  sheet?: ReadingSheet;
  updateField?: (field: keyof ReadingSheet, value: string) => void;
  updateCitation?: (index: number, field: 'text' | 'page', value: string) => void;
  addCitation?: () => void;
  removeCitation?: (index: number) => void;
  theme?: any;
}

interface SortableTabProps {
  tab: Tab;
  isActive: boolean;
  onSelect: (tabId: string) => void;
  onEdit: (tabId: string) => void;
  onDelete: (tabId: string) => void;
  isEditing: boolean;
  editingTitle: string;
  onTitleChange: (title: string) => void;
  onTitleSave: () => void;
  onTitleCancel: () => void;
  isCollapsed?: boolean;
}

const SortableTab: React.FC<SortableTabProps> = ({
  tab,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  isEditing,
  editingTitle,
  onTitleChange,
  onTitleSave,
  onTitleCancel,
  isCollapsed = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
        ${isActive 
          ? 'bg-white shadow-sm text-blue-600 border-b-2 border-blue-600' 
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        }
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
        ${isCollapsed ? 'justify-center' : ''}
      `}
      title={isCollapsed ? tab.title : ''}
    >
      {/* Drag Handle */}
      {!isCollapsed && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-70 transition-opacity"
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Tab Content */}
      <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : 'flex-1'}`} onClick={() => onSelect(tab.id)}>
        <span className="text-lg">{tab.icon}</span>
        
        {!isCollapsed && (
          isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') onTitleSave();
                  if (e.key === 'Escape') onTitleCancel();
                }}
                autoFocus
              />
              <button
                onClick={onTitleSave}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Check size={14} />
              </button>
              <button
                onClick={onTitleCancel}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <span className="text-sm font-medium truncate">{tab.title}</span>
          )
        )}
      </div>

      {/* Tab Actions */}
      {!isEditing && !isCollapsed && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(tab.id);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Renommer"
          >
            <Edit2 size={14} />
          </button>
          
          {!tab.isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(tab.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Supprimer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const TabManager: React.FC<TabManagerProps> = ({
  onTabsChange,
  sheet,
  updateField,
  updateCitation,
  addCitation,
  removeCitation,
  theme
}) => {
  const { tabs, activeTab, setActiveTab, addTab, deleteTab, updateTab } = useDynamicTabs();
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState('');
  const [newTabIcon, setNewTabIcon] = useState('📝');
  const [isTabSidebarCollapsed, setIsTabSidebarCollapsed] = useState(false);

  // Available icons for new tabs
  const availableIcons = [
    '📝', '📚', '🔍', '💭', '📊', '🎯', '🧩', '🎨', '📋', '🗂️',
    '⚡', '🚀', '💡', '🎪', '🎭', '🌟', '🔥', '❤️', '🎵', '🎬'
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Notify parent component of tab changes
  useEffect(() => {
    if (onTabsChange) {
      const tabsWithContent: Tab[] = tabs.map(tab => ({
        id: tab.id,
        title: tab.title,
        icon: tab.icon,
        content: getTabContent(tab.id),
        isDefault: tab.isDefault
      }));
      onTabsChange(tabsWithContent);
    }
  }, [tabs, onTabsChange]);

  // Generate content for each tab
  const getTabContent = (tabId: string) => {
    if (!sheet || !updateField || !updateCitation || !addCitation || !removeCitation || !theme) {
      return <div>Loading...</div>;
    }

    const sectionProps = {
      sheet,
      updateField,
      updateCitation,
      addCitation,
      removeCitation,
      theme
    };

    switch (tabId) {
      case 'resume-architecture':
        return <ResumeArchitectureSection {...sectionProps} />;
      case 'analyse-stylistique':
        return <AnalyseStylistiqueSection {...sectionProps} />;
      case 'problematiques-enjeux':
        return <ProblematiquesEnjeuxSection {...sectionProps} />;
      case 'images-oeuvre':
        return <ImagesOeuvreSection {...sectionProps} />;
      case 'contexte-perspectives':
        return <ContextePerspectivesSection {...sectionProps} />;
      case 'comparatisme':
        return <ComparatismeSection {...sectionProps} />;
      case 'annexes':
        return <AnnexesSection {...sectionProps} />;
      default:
        return (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-4">Contenu personnalisé</h3>
            <p className="text-gray-600 mb-6">
              Ceci est un onglet personnalisé. Vous pouvez ajouter ici tout contenu que vous souhaitez.
            </p>
            <div className="space-y-4">
              <textarea
                placeholder="Ajoutez votre contenu ici..."
                className="w-full px-4 py-3 rounded-lg border resize-vertical"
                rows={10}
                style={{
                  backgroundColor: theme?.background || '#f8f9fa',
                  borderColor: theme?.border || '#e9ecef',
                  color: theme?.text || '#2c3e50'
                }}
              />
            </div>
          </div>
        );
    }
  };

  const handleAddTab = () => {
    if (!newTabTitle.trim()) return;

    addTab(newTabTitle.trim(), newTabIcon);
    setNewTabTitle('');
    setNewTabIcon('📝');
    setShowAddForm(false);
  };

  const handleDeleteTab = (tabId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet onglet ?')) {
      deleteTab(tabId);
    }
  };

  const handleEditTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setEditingTab(tabId);
      setEditingTitle(tab.title);
    }
  };

  const handleSaveEdit = () => {
    if (editingTab && editingTitle.trim()) {
      updateTab(editingTab, { title: editingTitle.trim() });
      setEditingTab(null);
      setEditingTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTab(null);
    setEditingTitle('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over?.id);
      // This would need to be implemented in the hook if needed
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full" data-testid="tab-manager">
      {/* Tab Sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ${
        isTabSidebarCollapsed ? 'lg:w-16' : 'lg:w-80'
      }`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-gray-900 transition-opacity duration-200 ${
              isTabSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>Onglets</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTabSidebarCollapsed(!isTabSidebarCollapsed)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                title={isTabSidebarCollapsed ? "Développer" : "Réduire"}
              >
                {isTabSidebarCollapsed ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                )}
              </button>
              {!isTabSidebarCollapsed && (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ajouter un onglet"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Add Tab Form */}
          {showAddForm && !isTabSidebarCollapsed && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={newTabTitle}
                  onChange={(e) => setNewTabTitle(e.target.value)}
                  placeholder="Nom de l'onglet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewTabIcon(icon)}
                      className={`w-8 h-8 text-lg rounded hover:bg-gray-200 transition-colors ${
                        newTabIcon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddTab}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Tab List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {tabs.map(tab => (
                  <SortableTab
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onSelect={setActiveTab}
                    onEdit={handleEditTab}
                    onDelete={handleDeleteTab}
                    isEditing={editingTab === tab.id}
                    editingTitle={editingTitle}
                    onTitleChange={setEditingTitle}
                    onTitleSave={handleSaveEdit}
                    onTitleCancel={handleCancelEdit}
                    isCollapsed={isTabSidebarCollapsed}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {tabs.length === 0 && !isTabSidebarCollapsed && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Aucun onglet</p>
              <p className="text-xs">Cliquez sur + pour ajouter un onglet</p>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {activeTabData ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>{activeTabData.icon}</span>
                {activeTabData.title}
              </h2>
            </div>
            <div className="p-4 h-full overflow-y-auto">
              {getTabContent(activeTabData.id)}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Aucun onglet sélectionné</p>
              <p className="text-sm">Ajoutez un onglet pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabManager;
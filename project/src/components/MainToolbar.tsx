import React from 'react';
import { 
  Undo, 
  Redo, 
  FileText, 
  FolderOpen, 
  Quote, 
  StickyNote, 
  Plus, 
  Palette,
  RotateCcw,
  RotateCw,
  RefreshCw
} from 'lucide-react';

interface MainToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onAddTextZone: () => void;
  onAddImportZone: () => void;
  onAddCitationZone: () => void;
  onAddNotesZone: () => void;
  onAddTab: () => void;
  onOpenColorPicker: () => void;
  onResetTemplate: () => void;
  canUndo: boolean;
  canRedo: boolean;
  theme: any;
}

const MainToolbar: React.FC<MainToolbarProps> = ({
  onUndo,
  onRedo,
  onAddTextZone,
  onAddImportZone,
  onAddCitationZone,
  onAddNotesZone,
  onAddTab,
  onOpenColorPicker,
  onResetTemplate,
  canUndo,
  canRedo,
  theme
}) => {
  const buttonClass = (disabled: boolean = false) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 
    ${disabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
    }
    border border-gray-200 min-w-[120px] justify-center
  `;

  const iconButtonClass = (disabled: boolean = false) => `
    flex items-center justify-center p-2 rounded-lg transition-all duration-200 
    ${disabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
    }
    border border-gray-200 w-12 h-12
  `;

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Undo/Redo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={iconButtonClass(!canUndo)}
                title="Retour en arrière (Ctrl+Z)"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={iconButtonClass(!canRedo)}
                title="Retour à la modification (Ctrl+Y)"
              >
                <RotateCw size={18} />
              </button>
            </div>
            <div className="h-8 w-px bg-gray-300 mx-2" />
            <button
              onClick={onResetTemplate}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
              title="Réinitialiser le template"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline text-sm">Reset</span>
            </button>
          </div>

          {/* Center - Zone Creation Buttons */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <button
              onClick={onAddTextZone}
              className={`${buttonClass()} min-w-[140px]`}
              title="Ajouter une zone de texte"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Zone texte</span>
            </button>
            <button
              onClick={onAddImportZone}
              className={`${buttonClass()} min-w-[120px]`}
              title="Ajouter une zone d'importation"
            >
              <FolderOpen size={16} />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={onAddCitationZone}
              className={`${buttonClass()} min-w-[120px]`}
              title="Ajouter une zone de citation"
            >
              <Quote size={16} />
              <span className="hidden sm:inline">Citation</span>
            </button>
            <button
              onClick={onAddNotesZone}
              className={`${buttonClass()} min-w-[120px]`}
              title="Ajouter une zone de notes"
            >
              <StickyNote size={16} />
              <span className="hidden sm:inline">Notes</span>
            </button>
          </div>

          {/* Right side - Tab and Color */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-px bg-gray-300 mx-2" />
            <button
              onClick={onAddTab}
              className={`${buttonClass()} min-w-[120px]`}
              title="Ajouter un onglet"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Onglet</span>
            </button>
            <button
              onClick={onOpenColorPicker}
              className={iconButtonClass()}
              title="Sélecteur de couleurs"
            >
              <Palette size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainToolbar;
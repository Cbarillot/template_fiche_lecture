import React, { useState, useEffect } from 'react';
import { 
  Undo2, 
  Redo2, 
  History, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useHistoryManager } from '../hooks/useHistoryManager';

interface HistoryPanelProps {
  theme?: any;
  className?: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ theme, className = '' }) => {
  const {
    history,
    currentIndex,
    undo,
    redo,
    clearHistory,
    getHistorySummary
  } = useHistoryManager();

  const [isExpanded, setIsExpanded] = useState(false);
  const [historySummary, setHistorySummary] = useState(getHistorySummary());

  // Update history summary when history changes
  useEffect(() => {
    setHistorySummary(getHistorySummary());
  }, [history, currentIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create':
        return '➕';
      case 'delete':
        return '🗑️';
      case 'move':
        return '📍';
      case 'resize':
        return '🔧';
      case 'content':
        return '📝';
      case 'rename':
        return '✏️';
      case 'color':
        return '🎨';
      case 'restore':
        return '🔄';
      default:
        return '📋';
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'text-green-600';
      case 'delete':
        return 'text-red-600';
      case 'move':
        return 'text-blue-600';
      case 'resize':
        return 'text-purple-600';
      case 'content':
        return 'text-gray-600';
      case 'rename':
        return 'text-yellow-600';
      case 'color':
        return 'text-pink-600';
      case 'restore':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Historique</h3>
            <span className="text-xs text-gray-500">
              {historySummary.total} action{historySummary.total !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!historySummary.canUndo}
              className={`p-1 rounded transition-colors ${
                historySummary.canUndo
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Annuler (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            
            <button
              onClick={redo}
              disabled={!historySummary.canRedo}
              className={`p-1 rounded transition-colors ${
                historySummary.canRedo
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Refaire (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title={isExpanded ? 'Réduire' : 'Développer'}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Undo2 size={12} />
            <span>Ctrl+Z</span>
          </div>
          <div className="w-px h-3 bg-gray-300" />
          <div className="flex items-center gap-1">
            <Redo2 size={12} />
            <span>Ctrl+Y</span>
          </div>
          <div className="flex-1" />
          {historySummary.total > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Effacer l'historique"
            >
              <Trash2 size={12} />
              <span>Effacer</span>
            </button>
          )}
        </div>
      </div>

      {/* History List */}
      {isExpanded && (
        <div className="max-h-60 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Clock size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune action dans l'historique</p>
              <p className="text-xs text-gray-400 mt-1">
                Vos actions apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {history.map((action, index) => (
                <div
                  key={action.id}
                  className={`
                    flex items-center gap-2 p-2 rounded text-sm transition-colors
                    ${index === currentIndex 
                      ? 'bg-blue-50 border border-blue-200' 
                      : index > currentIndex 
                        ? 'bg-gray-50 opacity-50' 
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg" title={action.type}>
                      {getActionIcon(action.type)}
                    </span>
                    <div className="flex-1">
                      <div className={`font-medium ${getActionColor(action.type)}`}>
                        {action.description}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        {formatTime(action.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {index === currentIndex ? (
                      <CheckCircle size={14} className="text-green-500" title="Position actuelle" />
                    ) : index > currentIndex ? (
                      <XCircle size={14} className="text-gray-400" title="Action annulée" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {!isExpanded && historySummary.total > 0 && (
        <div className="p-3 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Position: {currentIndex + 1} / {historySummary.total}</span>
            <div className="flex items-center gap-2">
              {Object.entries(historySummary.actionCounts).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1">
                  <span>{getActionIcon(type)}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
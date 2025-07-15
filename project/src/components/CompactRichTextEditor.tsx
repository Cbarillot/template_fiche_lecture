import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Type,
  Palette,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';

interface CompactRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: any;
  className?: string;
  minHeight?: number;
  isCompact?: boolean;
}

const CompactRichTextEditor: React.FC<CompactRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tapez votre texte ici...',
  theme,
  className = '',
  minHeight = 120,
  isCompact = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(!isCompact);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isFocused, setIsFocused] = useState(false);

  // Common colors for quick access
  const quickColors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F59E0B', 
    '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const isActive = (command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    command, 
    value, 
    tooltip, 
    isActive: active,
    onClick
  }: {
    icon: React.ComponentType<{ size?: number }>;
    command?: string;
    value?: string;
    tooltip: string;
    isActive?: boolean;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick || (() => executeCommand(command!, value))}
      className={`
        p-1.5 rounded transition-all duration-150 hover:bg-gray-100 
        ${(active || isActive?.(command!)) ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}
      `}
      title={tooltip}
    >
      <Icon size={16} />
    </button>
  );

  const compactToolbar = [
    { icon: Bold, command: 'bold', tooltip: 'Gras' },
    { icon: Italic, command: 'italic', tooltip: 'Italique' },
    { icon: Underline, command: 'underline', tooltip: 'Souligné' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Liste à puces' },
  ];

  const fullToolbar = [
    { icon: Bold, command: 'bold', tooltip: 'Gras' },
    { icon: Italic, command: 'italic', tooltip: 'Italique' },
    { icon: Underline, command: 'underline', tooltip: 'Souligné' },
    { icon: Strikethrough, command: 'strikethrough', tooltip: 'Barré' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Aligner à gauche' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Centrer' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Aligner à droite' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Liste à puces' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Liste numérotée' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', tooltip: 'Citation' },
  ];

  const toolbar = isCompact && !isToolbarExpanded ? compactToolbar : fullToolbar;

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div className={`
        flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-lg
        ${isFocused ? 'bg-blue-50' : ''}
        transition-colors duration-200
      `}>
        {/* Main toolbar buttons */}
        <div className="flex items-center gap-1">
          {toolbar.map((item, index) => (
            <ToolbarButton
              key={index}
              icon={item.icon}
              command={item.command}
              value={item.value}
              tooltip={item.tooltip}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Color picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Couleur du texte"
          >
            <div className="relative">
              <Type size={16} className="text-gray-600" />
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div className="grid grid-cols-5 gap-1 w-32">
                {quickColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`
                      w-6 h-6 rounded border-2 transition-all duration-150 hover:scale-110
                      ${currentColor === color ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-300'}
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expand/Collapse button for compact mode */}
        {isCompact && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title={isToolbarExpanded ? 'Réduire la barre d\'outils' : 'Développer la barre d\'outils'}
            >
              {isToolbarExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          p-4 border border-gray-200 rounded-b-lg outline-none resize-none
          ${isFocused ? 'border-blue-500 bg-blue-50/20' : 'bg-white'}
          transition-all duration-200
        `}
        style={{ 
          minHeight: `${minHeight}px`,
          fontFamily: theme?.textFont || 'serif',
          fontSize: '14px',
          lineHeight: '1.6',
          color: theme?.text || '#374151'
        }}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />

      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
          pointer-events: none;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #D1D5DB;
          padding-left: 12px;
          margin: 8px 0;
          color: #6B7280;
          font-style: italic;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 8px 0;
          padding-left: 20px;
        }
        
        [contenteditable] li {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default CompactRichTextEditor;
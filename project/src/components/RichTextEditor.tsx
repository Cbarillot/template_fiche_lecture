import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Highlighter, Type, Palette } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme: any;
  rows?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '',
  theme,
  rows = 4,
  className = '',
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const highlightColors = [
    '#ffeb3b', // Yellow
    '#4caf50', // Green
    '#2196f3', // Blue
    '#ff9800', // Orange
    '#e91e63', // Pink
    '#9c27b0', // Purple
    '#f44336', // Red
    '#00bcd4', // Cyan
  ];

  const textColors = [
    '#000000', // Black
    '#424242', // Dark Gray
    '#f44336', // Red
    '#e91e63', // Pink
    '#9c27b0', // Purple
    '#3f51b5', // Indigo
    '#2196f3', // Blue
    '#03a9f4', // Light Blue
    '#00bcd4', // Cyan
    '#009688', // Teal
    '#4caf50', // Green
    '#8bc34a', // Light Green
    '#cddc39', // Lime
    '#ffeb3b', // Yellow
    '#ffc107', // Amber
    '#ff9800', // Orange
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
        setShowTextColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  const applyHighlight = (color: string) => {
    execCommand('hiliteColor', color);
    setShowColorPicker(false);
  };

  const applyTextColor = (color: string) => {
    execCommand('foreColor', color);
    setShowTextColorPicker(false);
  };

  const removeFormatting = () => {
    execCommand('removeFormat');
  };

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    isActive = false, 
    title 
  }: { 
    onClick: () => void; 
    icon: React.ComponentType<{ size?: number }>; 
    isActive?: boolean; 
    title: string; 
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 hover:opacity-80 ${
        isActive 
          ? 'text-white shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      style={{ 
        backgroundColor: isActive ? theme.primary : 'transparent',
      }}
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div 
        className="flex items-center gap-1 p-2 border-b rounded-t-lg"
        style={{ 
          backgroundColor: '#f8f9fa',
          borderColor: theme.border,
        }}
      >
        <ToolbarButton
          onClick={() => execCommand('bold')}
          icon={Bold}
          title="Gras (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => execCommand('italic')}
          icon={Italic}
          title="Italique (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => execCommand('underline')}
          icon={Underline}
          title="Souligné (Ctrl+U)"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        {/* Text Color Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowTextColorPicker(!showTextColorPicker);
              setShowColorPicker(false);
            }}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600"
            title="Couleur du texte"
          >
            <Type size={16} />
          </button>
          
          {showTextColorPicker && (
            <div 
              ref={colorPickerRef}
              className="absolute top-10 left-0 z-50 bg-white border rounded-lg shadow-lg p-3"
              style={{ borderColor: theme.border }}
            >
              <div className="grid grid-cols-4 gap-2">
                {textColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applyTextColor(color)}
                    className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={`Couleur: ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Highlight Color Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowTextColorPicker(false);
            }}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600"
            title="Surligner"
          >
            <Highlighter size={16} />
          </button>
          
          {showColorPicker && (
            <div 
              ref={colorPickerRef}
              className="absolute top-10 left-0 z-50 bg-white border rounded-lg shadow-lg p-3"
              style={{ borderColor: theme.border }}
            >
              <div className="grid grid-cols-4 gap-2">
                {highlightColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applyHighlight(color)}
                    className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={`Surligner: ${color}`}
                  />
                ))}
              </div>
              <div className="mt-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => applyHighlight('transparent')}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Supprimer surlignage
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          type="button"
          onClick={removeFormatting}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600"
          title="Supprimer la mise en forme"
        >
          <Palette size={16} />
        </button>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 border rounded-b-lg transition-all duration-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none resize-none"
        style={{
          backgroundColor: '#ffffff',
          borderColor: theme.border,
          color: theme.text,
          minHeight: `${rows * 1.5}rem`,
          maxHeight: `${rows * 3}rem`,
          overflowY: 'auto',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
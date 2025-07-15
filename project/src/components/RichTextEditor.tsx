import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Highlighter, Type, Palette } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme: any;
  rows?: number;
  className?: string;
  style?: React.CSSProperties;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '',
  theme,
  rows = 4,
  className = '',
  style = {},
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

  // Helper function to get all text nodes
  const getTextNodesIn = (node: Node): Text[] => {
    const textNodes: Text[] = [];
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text);
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        textNodes.push(...getTextNodesIn(node.childNodes[i]));
      }
    }
    return textNodes;
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Save cursor position
      const selection = window.getSelection();
      let cursorPosition = 0;
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(editorRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        cursorPosition = preSelectionRange.toString().length;
      }
      
      // Update content
      editorRef.current.innerHTML = value;
      
      // Restore cursor position
      if (cursorPosition > 0) {
        const textNodes = getTextNodesIn(editorRef.current);
        let charCount = 0;
        let targetNode = null;
        let targetOffset = 0;
        
        for (let i = 0; i < textNodes.length; i++) {
          const node = textNodes[i];
          const nodeLength = node.textContent?.length || 0;
          
          if (charCount + nodeLength >= cursorPosition) {
            targetNode = node;
            targetOffset = cursorPosition - charCount;
            break;
          }
          charCount += nodeLength;
        }
        
        if (targetNode && selection) {
          try {
            const range = document.createRange();
            range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0));
            range.setEnd(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0));
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            // Fallback: place cursor at the end
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
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
      // Use the current content instead of innerHTML to preserve cursor
      const newValue = editorRef.current.innerHTML;
      onChange(newValue);
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
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
        onPaste={handlePaste}
        className="w-full px-4 py-3 border rounded-b-lg transition-all duration-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none resize-none"
        style={{
          backgroundColor: style.backgroundColor || '#ffffff',
          borderColor: theme.border,
          color: theme.text,
          minHeight: `${rows * 1.5}rem`,
          maxHeight: `${rows * 3}rem`,
          overflowY: 'auto',
          opacity: style.opacity || 1,
          ...style,
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
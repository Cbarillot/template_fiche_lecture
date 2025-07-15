import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Copy, Palette, Trash2 } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  size?: number;
  showColorCodes?: boolean;
  showPresets?: boolean;
  onAddToPresets?: (color: string) => void;
  presets?: string[];
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface HSVColor {
  h: number;
  s: number;
  v: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

// Color conversion utilities
const hexToRgb = (hex: string): RGBColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const rgbToHsv = (r: number, g: number, b: number): HSVColor => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;
  
  if (diff !== 0) {
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h: number, s: number, v: number): RGBColor => {
  h /= 360;
  s /= 100;
  v /= 100;
  
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  let r: number, g: number, b: number;
  
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    default: r = 0, g = 0, b = 0;
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

const rgbToHsl = (r: number, g: number, b: number): HSLColor => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const EnhancedColorPicker: React.FC<ColorPickerProps> = ({ 
  value, 
  onChange, 
  size = 200,
  showColorCodes = true,
  showPresets = true,
  onAddToPresets,
  presets = [],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'wheel' | 'saturation' | null>(null);
  const [currentHSV, setCurrentHSV] = useState<HSVColor>({ h: 0, s: 100, v: 100 });
  const [currentRGB, setCurrentRGB] = useState<RGBColor>({ r: 255, g: 0, b: 0 });
  const [currentHSL, setCurrentHSL] = useState<HSLColor>({ h: 0, s: 100, l: 50 });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const centerPoint = { x: size / 2, y: size / 2 };
  const outerRadius = size / 2 - 10;
  const innerRadius = size / 2 - 40;
  const saturationSize = innerRadius * 0.8;

  // Convert hex to all color formats when value changes
  useEffect(() => {
    if (!value || typeof value !== 'string') return;
    
    try {
      const rgb = hexToRgb(value);
      if (rgb) {
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        setCurrentHSV(hsv);
        setCurrentRGB(rgb);
        setCurrentHSL(hsl);
      }
    } catch (error) {
      console.error('Error converting color:', error);
    }
  }, [value]);

  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw hue ring
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;
      
      const rgb = hsvToRgb(angle, 100, 100);
      ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.lineWidth = outerRadius - innerRadius;
      ctx.beginPath();
      ctx.arc(centerPoint.x, centerPoint.y, (innerRadius + outerRadius) / 2, startAngle, endAngle);
      ctx.stroke();
    }

    // Draw saturation/brightness square
    const gradient = ctx.createLinearGradient(
      centerPoint.x - saturationSize, centerPoint.y - saturationSize,
      centerPoint.x + saturationSize, centerPoint.y - saturationSize
    );
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, `hsl(${currentHSV.h}, 100%, 50%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      centerPoint.x - saturationSize, 
      centerPoint.y - saturationSize, 
      saturationSize * 2, 
      saturationSize * 2
    );

    // Black gradient for brightness
    const blackGradient = ctx.createLinearGradient(
      centerPoint.x, centerPoint.y - saturationSize,
      centerPoint.x, centerPoint.y + saturationSize
    );
    blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
    blackGradient.addColorStop(1, 'rgba(0,0,0,1)');
    
    ctx.fillStyle = blackGradient;
    ctx.fillRect(
      centerPoint.x - saturationSize, 
      centerPoint.y - saturationSize, 
      saturationSize * 2, 
      saturationSize * 2
    );

    // Draw hue cursor
    const hueAngle = (currentHSV.h * Math.PI) / 180;
    const hueRadius = (innerRadius + outerRadius) / 2;
    const hueX = centerPoint.x + Math.cos(hueAngle) * hueRadius;
    const hueY = centerPoint.y + Math.sin(hueAngle) * hueRadius;

    ctx.beginPath();
    ctx.arc(hueX, hueY, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hueX, hueY, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw saturation/brightness cursor
    const satX = centerPoint.x - saturationSize + (currentHSV.s / 100) * saturationSize * 2;
    const satY = centerPoint.y - saturationSize + (1 - currentHSV.v / 100) * saturationSize * 2;

    ctx.beginPath();
    ctx.arc(satX, satY, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(satX, satY, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [currentHSV, size, centerPoint, innerRadius, outerRadius, saturationSize]);

  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  const getMousePosition = (e: React.MouseEvent | MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const pos = getMousePosition(e);
    const dx = pos.x - centerPoint.x;
    const dy = pos.y - centerPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= innerRadius && distance <= outerRadius) {
      setDragTarget('wheel');
      setIsDragging(true);
      updateHue(pos);
    } else if (Math.abs(dx) <= saturationSize && Math.abs(dy) <= saturationSize) {
      setDragTarget('saturation');
      setIsDragging(true);
      updateSaturationBrightness(pos);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragTarget) return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    if (dragTarget === 'wheel') {
      updateHue(pos);
    } else if (dragTarget === 'saturation') {
      updateSaturationBrightness(pos);
    }
  }, [isDragging, dragTarget, updateHue, updateSaturationBrightness]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragTarget(null);
  }, []);

  const updateHue = useCallback((pos: Point) => {
    const dx = pos.x - centerPoint.x;
    const dy = pos.y - centerPoint.y;
    const angle = Math.atan2(dy, dx);
    const hue = (angle * 180 / Math.PI + 360) % 360;
    
    const newHSV = { ...currentHSV, h: hue };
    setCurrentHSV(newHSV);
    
    const rgb = hsvToRgb(newHSV.h, newHSV.s, newHSV.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    setCurrentRGB(rgb);
    setCurrentHSL(rgbToHsl(rgb.r, rgb.g, rgb.b));
    onChange(hex);
  }, [currentHSV, centerPoint, onChange]);

  const updateSaturationBrightness = useCallback((pos: Point) => {
    const dx = pos.x - centerPoint.x;
    const dy = pos.y - centerPoint.y;
    
    const clampedX = Math.max(-saturationSize, Math.min(saturationSize, dx));
    const clampedY = Math.max(-saturationSize, Math.min(saturationSize, dy));
    
    const saturation = Math.max(0, Math.min(100, ((clampedX + saturationSize) / (saturationSize * 2)) * 100));
    const brightness = Math.max(0, Math.min(100, (1 - (clampedY + saturationSize) / (saturationSize * 2)) * 100));
    
    const newHSV = { ...currentHSV, s: saturation, v: brightness };
    setCurrentHSV(newHSV);
    
    const rgb = hsvToRgb(newHSV.h, newHSV.s, newHSV.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    setCurrentRGB(rgb);
    setCurrentHSL(rgbToHsl(rgb.r, rgb.g, rgb.b));
    onChange(hex);
  }, [currentHSV, centerPoint, saturationSize, onChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(format);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const formatRgb = (rgb: RGBColor) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const formatHsl = (hsl: HSLColor) => `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

  return (
    <div className={`color-picker ${className}`}>
      {/* Color Wheel */}
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          onMouseDown={handleMouseDown}
          className="cursor-crosshair rounded-full border border-gray-200 shadow-sm"
        />
        
        {/* Color Preview */}
        <div className="mt-4 flex items-center gap-3">
          <div 
            className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-inner"
            style={{ backgroundColor: value }}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 mb-1">Couleur actuelle</div>
            <div className="text-xs text-gray-500">
              Cliquez et glissez pour modifier
            </div>
          </div>
        </div>
      </div>

      {/* Color Codes */}
      {showColorCodes && (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Codes couleur</div>
          
          {/* HEX */}
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 w-8">HEX</span>
              <input
                type="text"
                value={value.toUpperCase()}
                onChange={(e) => {
                  const hex = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(hex)) {
                    onChange(hex);
                  }
                }}
                className="text-sm font-mono bg-transparent border-none outline-none flex-1"
              />
            </div>
            <button
              onClick={() => copyToClipboard(value, 'HEX')}
              className={`p-1 rounded transition-colors ${
                copiedCode === 'HEX' 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Copier"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* RGB */}
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 w-8">RGB</span>
              <span className="text-sm font-mono">{formatRgb(currentRGB)}</span>
            </div>
            <button
              onClick={() => copyToClipboard(formatRgb(currentRGB), 'RGB')}
              className={`p-1 rounded transition-colors ${
                copiedCode === 'RGB' 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Copier"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* HSL */}
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 w-8">HSL</span>
              <span className="text-sm font-mono">{formatHsl(currentHSL)}</span>
            </div>
            <button
              onClick={() => copyToClipboard(formatHsl(currentHSL), 'HSL')}
              className={`p-1 rounded transition-colors ${
                copiedCode === 'HSL' 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Copier"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Presets */}
      {showPresets && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Couleurs favorites</span>
            {onAddToPresets && (
              <button
                onClick={() => onAddToPresets(value)}
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                title="Ajouter aux favoris"
              >
                <Palette size={14} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-8 gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => onChange(preset)}
                className={`
                  w-6 h-6 rounded border-2 transition-all duration-200 hover:scale-110
                  ${value === preset ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
                `}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
        </div>
      )}

      {/* Copy confirmation */}
      {copiedCode && (
        <div className="mt-2 text-xs text-green-600 text-center">
          Code {copiedCode} copié !
        </div>
      )}
    </div>
  );
};

export default EnhancedColorPicker;
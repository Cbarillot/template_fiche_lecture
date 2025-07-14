import React, { useRef, useEffect, useState, useCallback } from 'react';
import { hsvToRgb, rgbToHex, hexToHsl, hslToHex, rgbToHsv, HSVColor } from '../utils/colorUtils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  size?: number;
}

interface Point {
  x: number;
  y: number;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, size = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'wheel' | 'saturation' | null>(null);
  const [currentHSV, setCurrentHSV] = useState<HSVColor>({ h: 0, s: 100, v: 100 });

  const centerPoint = { x: size / 2, y: size / 2 };
  const outerRadius = size / 2 - 10;
  const innerRadius = size / 2 - 40;
  const saturationSize = innerRadius * 0.8;

  // Convert hex to HSV when value changes
  useEffect(() => {
    const hsl = hexToHsl(value);
    if (hsl) {
      const rgb = { r: 0, g: 0, b: 0 };
      const tempRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      Object.assign(rgb, tempRgb);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setCurrentHSV(hsv);
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
    const pos = getMousePosition(e);
    const dx = pos.x - centerPoint.x;
    const dy = pos.y - centerPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= innerRadius && distance <= outerRadius) {
      // Clicked on color wheel
      setDragTarget('wheel');
      setIsDragging(true);
      updateHue(pos);
    } else if (Math.abs(dx) <= saturationSize && Math.abs(dy) <= saturationSize) {
      // Clicked on saturation/brightness area
      setDragTarget('saturation');
      setIsDragging(true);
      updateSaturationBrightness(pos);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragTarget) return;

    const pos = getMousePosition(e);
    
    if (dragTarget === 'wheel') {
      updateHue(pos);
    } else if (dragTarget === 'saturation') {
      updateSaturationBrightness(pos);
    }
  }, [isDragging, dragTarget]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragTarget(null);
  }, []);

  const updateHue = (pos: Point) => {
    const dx = pos.x - centerPoint.x;
    const dy = pos.y - centerPoint.y;
    const angle = Math.atan2(dy, dx);
    const hue = (angle * 180 / Math.PI + 360) % 360;
    
    const newHSV = { ...currentHSV, h: hue };
    setCurrentHSV(newHSV);
    
    const rgb = hsvToRgb(newHSV.h, newHSV.s, newHSV.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onChange(hex);
  };

  const updateSaturationBrightness = (pos: Point) => {
    const dx = pos.x - centerPoint.x;
    const dy = pos.y - centerPoint.y;
    
    // Clamp to saturation square bounds
    const clampedX = Math.max(-saturationSize, Math.min(saturationSize, dx));
    const clampedY = Math.max(-saturationSize, Math.min(saturationSize, dy));
    
    const saturation = Math.max(0, Math.min(100, ((clampedX + saturationSize) / (saturationSize * 2)) * 100));
    const brightness = Math.max(0, Math.min(100, (1 - (clampedY + saturationSize) / (saturationSize * 2)) * 100));
    
    const newHSV = { ...currentHSV, s: saturation, v: brightness };
    setCurrentHSV(newHSV);
    
    const rgb = hsvToRgb(newHSV.h, newHSV.s, newHSV.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onChange(hex);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="color-picker">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'block',
          borderRadius: '50%',
          margin: '0 auto'
        }}
      />
    </div>
  );
};

export default ColorPicker;
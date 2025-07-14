import React, { useRef, useEffect, useState, useCallback } from 'react';
import { hsvToRgb, rgbToHex, hexToHsl, hslToHex, hslToRgb, rgbToHsv, HSVColor, isValidHex } from '../utils/colorUtils';

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
    try {
      console.log('Converting hex to HSV for value:', value);
      
      if (!value || typeof value !== 'string') {
        console.error('Invalid value for hex conversion:', value);
        return;
      }
      
      const hsl = hexToHsl(value);
      console.log('Converted HSL:', hsl);
      
      if (hsl) {
        const rgb = { r: 0, g: 0, b: 0 };
        const tempRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        Object.assign(rgb, tempRgb);
        console.log('Converted RGB:', rgb);
        
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        console.log('Converted HSV:', hsv);
        
        // Validate HSV values
        if (hsv && typeof hsv.h === 'number' && typeof hsv.s === 'number' && typeof hsv.v === 'number') {
          setCurrentHSV(hsv);
          console.log('HSV state updated successfully');
        } else {
          console.error('Invalid HSV values:', hsv);
        }
      } else {
        console.error('Failed to convert hex to HSL:', value);
      }
    } catch (error) {
      console.error('Error in hex to HSV conversion:', error);
    }
  }, [value]);

  const drawColorWheel = useCallback(() => {
    try {
      console.log('Drawing color wheel');
      
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas ref is null');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Cannot get 2D context from canvas');
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw hue ring
      for (let angle = 0; angle < 360; angle += 1) {
        const startAngle = (angle * Math.PI) / 180;
        const endAngle = ((angle + 1) * Math.PI) / 180;
        
        const rgb = hsvToRgb(angle, 100, 100);
        if (!rgb) {
          console.error('Failed to convert HSV to RGB for angle:', angle);
          continue;
        }
        
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
      
      console.log('Color wheel drawn successfully');
    } catch (error) {
      console.error('Error in drawColorWheel:', error);
      alert('Erreur lors du rendu du sélecteur de couleur');
    }
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
    try {
      console.log('Mouse down event triggered');
      
      const pos = getMousePosition(e);
      console.log('Mouse position:', pos);
      
      // Validate position
      if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        console.error('Invalid mouse position:', pos);
        return;
      }
      
      const dx = pos.x - centerPoint.x;
      const dy = pos.y - centerPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      console.log('Distance from center:', distance);

      if (distance >= innerRadius && distance <= outerRadius) {
        // Clicked on color wheel
        console.log('Clicked on color wheel');
        setDragTarget('wheel');
        setIsDragging(true);
        updateHue(pos);
      } else if (Math.abs(dx) <= saturationSize && Math.abs(dy) <= saturationSize) {
        // Clicked on saturation/brightness area
        console.log('Clicked on saturation/brightness area');
        setDragTarget('saturation');
        setIsDragging(true);
        updateSaturationBrightness(pos);
      } else {
        console.log('Clicked outside interactive areas');
      }
    } catch (error) {
      console.error('Error in handleMouseDown:', error);
      alert('Erreur lors de la gestion du clic');
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    try {
      if (!isDragging || !dragTarget) return;

      console.log('Mouse move event triggered, dragTarget:', dragTarget);
      
      const pos = getMousePosition(e);
      console.log('Mouse move position:', pos);
      
      // Validate position
      if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        console.error('Invalid mouse position during move:', pos);
        return;
      }
      
      if (dragTarget === 'wheel') {
        updateHue(pos);
      } else if (dragTarget === 'saturation') {
        updateSaturationBrightness(pos);
      }
    } catch (error) {
      console.error('Error in handleMouseMove:', error);
      // Don't show alert for move events as they fire frequently
    }
  }, [isDragging, dragTarget]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragTarget(null);
  }, []);

  const updateHue = (pos: Point) => {
    try {
      console.log('UpdateHue called with position:', pos);
      
      // Validate position input
      if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        console.error('Invalid position input:', pos);
        return;
      }
      
      const dx = pos.x - centerPoint.x;
      const dy = pos.y - centerPoint.y;
      const angle = Math.atan2(dy, dx);
      const hue = (angle * 180 / Math.PI + 360) % 360;
      
      console.log('Calculated hue:', hue);
      
      // Validate hue value
      if (isNaN(hue) || hue < 0 || hue > 360) {
        console.error('Invalid hue value:', hue);
        alert('Erreur: Valeur de teinte invalide');
        return;
      }
      
      const newHSV = { ...currentHSV, h: hue };
      console.log('New HSV:', newHSV);
      
      setCurrentHSV(newHSV);
      
      const rgb = hsvToRgb(newHSV.h, newHSV.s, newHSV.v);
      console.log('Converted RGB:', rgb);
      
      // Validate RGB values
      if (!rgb || typeof rgb.r !== 'number' || typeof rgb.g !== 'number' || typeof rgb.b !== 'number') {
        console.error('Invalid RGB values:', rgb);
        alert('Erreur: Conversion couleur invalide');
        return;
      }
      
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      console.log('Converted hex:', hex);
      
      // Validate hex output
      if (!hex || !isValidHex(hex)) {
        console.error('Invalid hex output:', hex);
        alert('Erreur: Format couleur hexadécimal invalide');
        return;
      }
      
      onChange(hex);
      console.log('Color change completed successfully');
    } catch (error) {
      console.error('Error in updateHue:', error);
      alert('Erreur lors de la mise à jour de la teinte');
    }
  };

  const updateSaturationBrightness = (pos: Point) => {
    try {
      console.log('UpdateSaturationBrightness called with position:', pos);
      
      // Validate position input
      if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        console.error('Invalid position input:', pos);
        return;
      }
      
      const dx = pos.x - centerPoint.x;
      const dy = pos.y - centerPoint.y;
      
      // Clamp to saturation square bounds
      const clampedX = Math.max(-saturationSize, Math.min(saturationSize, dx));
      const clampedY = Math.max(-saturationSize, Math.min(saturationSize, dy));
      
      const saturation = Math.max(0, Math.min(100, ((clampedX + saturationSize) / (saturationSize * 2)) * 100));
      const brightness = Math.max(0, Math.min(100, (1 - (clampedY + saturationSize) / (saturationSize * 2)) * 100));
      
      console.log('Calculated saturation:', saturation, 'brightness:', brightness);
      
      // Validate saturation and brightness values
      if (isNaN(saturation) || isNaN(brightness) || saturation < 0 || saturation > 100 || brightness < 0 || brightness > 100) {
        console.error('Invalid saturation or brightness values:', { saturation, brightness });
        alert('Erreur: Valeurs de saturation ou luminosité invalides');
        return;
      }
      
      const newHSV = { ...currentHSV, s: saturation, v: brightness };
      console.log('New HSV:', newHSV);
      
      setCurrentHSV(newHSV);
      
      const rgb = hsvToRgb(newHSV.h, newHSV.s, newHSV.v);
      console.log('Converted RGB:', rgb);
      
      // Validate RGB values
      if (!rgb || typeof rgb.r !== 'number' || typeof rgb.g !== 'number' || typeof rgb.b !== 'number') {
        console.error('Invalid RGB values:', rgb);
        alert('Erreur: Conversion couleur invalide');
        return;
      }
      
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      console.log('Converted hex:', hex);
      
      // Validate hex output
      if (!hex || !isValidHex(hex)) {
        console.error('Invalid hex output:', hex);
        alert('Erreur: Format couleur hexadécimal invalide');
        return;
      }
      
      onChange(hex);
      console.log('Saturation/brightness change completed successfully');
    } catch (error) {
      console.error('Error in updateSaturationBrightness:', error);
      alert('Erreur lors de la mise à jour de la saturation/luminosité');
    }
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
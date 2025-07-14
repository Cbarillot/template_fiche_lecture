import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Eye, Trash2 } from 'lucide-react';
import { resizeImage, validateImageFile, generateThumbnail } from '../utils/imageUtils';

interface BackgroundImageUploadProps {
  currentImage?: string;
  onImageChange: (imageData: string | null) => void;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  className?: string;
}

const BackgroundImageUpload: React.FC<BackgroundImageUploadProps> = ({
  currentImage,
  onImageChange,
  opacity = 0.1,
  onOpacityChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      // Generate thumbnail for preview
      const thumbnail = await generateThumbnail(file, 300);
      setPreview(thumbnail);
      
      // Resize image for background use
      const resizedImage = await resizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'jpeg'
      });

      onImageChange(resizedImage);
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Erreur lors du traitement de l\'image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    setPreview(null);
    setShowPreview(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const currentImageToShow = currentImage || preview;

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium mb-2">
          Image de fond personnalisée
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Formats acceptés: JPG, PNG, WebP. Taille max: 10MB
        </p>
      </div>

      {/* Upload area */}
      <div className="space-y-3">
        {!currentImageToShow ? (
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Traitement en cours...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Cliquez pour sélectionner une image
                </p>
                <p className="text-xs text-gray-500">
                  L'image sera redimensionnée automatiquement
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={currentImageToShow}
                      alt="Aperçu de l'image de fond"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black rounded-lg" style={{ opacity: 1 - opacity }}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Image de fond ajoutée</p>
                    <p className="text-xs text-gray-500">
                      Cliquez sur l'œil pour prévisualiser
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                    title="Prévisualiser"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={handleUploadClick}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50"
                    title="Changer d'image"
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opacity control */}
        {currentImageToShow && onOpacityChange && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium mb-2">
              Opacité de l'image ({Math.round(opacity * 100)}%)
            </label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && currentImageToShow && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X size={16} />
            </button>
            <img
              src={currentImageToShow}
              alt="Aperçu de l'image de fond"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                Aperçu de l'image de fond (opacité: {Math.round(opacity * 100)}%)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundImageUpload;
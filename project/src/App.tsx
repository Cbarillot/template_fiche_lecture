import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Camera, Save, Printer, Link } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { exportSimple, exportModern, exportWebStyle, exportSimpleWeb, ExportOptions } from './exports';
import { downloadFile, openFileInNewTab } from './exports/utils';

// Composant pour l'upload d'images et documents
const ImageUploadZone = ({ label }: { label: string }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type === 'application/pdf') return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('text')) return '📋';
    return '📎';
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-4 transition-all duration-200 hover:border-opacity-80 cursor-pointer"
         style={{ borderColor: 'var(--primary-color, #667eea)', backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
      <input
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
        id={`file-input-${label.replace(/\s+/g, '-')}`}
      />
      <label htmlFor={`file-input-${label.replace(/\s+/g, '-')}`} className="cursor-pointer">
        <div className="text-center">
          <Camera className="mx-auto mb-2 opacity-60" size={24} />
          <p className="text-sm text-gray-600">
            📎 Cliquez pour ajouter {label}
          </p>
        </div>
      </label>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex items-center gap-2">
                <span>{getFileIcon(file)}</span>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant pour la gestion des liens
const LinkManager = ({ sectionKey }: { sectionKey: string }) => {
  const [links, setLinks] = useState<Array<{ title: string; url: string }>>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const addLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      setLinks(prev => [...prev, { ...newLink }]);
      setNewLink({ title: '', url: '' });
      setShowAddForm(false);
    }
  };

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex-1">
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {link.title}
            </a>
            <p className="text-xs text-gray-500 truncate">{link.url}</p>
          </div>
          <button
            onClick={() => removeLink(index)}
            className="text-red-500 hover:text-red-700 p-1 ml-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      
      {showAddForm ? (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Titre du lien"
            value={newLink.title}
            onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="url"
            placeholder="https://..."
            value={newLink.url}
            onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <div className="flex gap-2">
            <button
              onClick={addLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ajouter
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewLink({ title: '', url: '' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 w-full justify-center"
        >
          <Link size={16} />
          Ajouter un lien
        </button>
      )}
    </div>
  );
};

interface Citation {
  text: string;
  page: string;
}

interface ReadingSheet {
  titre: string;
  auteur: string;
  resume: string;
  plan: string;
  temporalites: string;
  pointsVue: string;
  personnages: string;
  registres: string;
  rythme: string;
  figures: string;
  procedes: string;
  lexique: string;
  citations: Citation[];
  axes: string;
  tensions: string;
  lectures: string;
  intuitions: string;
  images: string;
  fonction: string;
  references: string;
  biographie: string;
  place: string;
  courants: string;
  contexte: string;
  reception: string;
  oeuvres: string;
  thematiques: string;
  convergence: string;
  glossaire: string;
  notes: string;
  schemas: string;
}

const themes = {
  purple: {
    name: 'Violet',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#8e44ad',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e9ecef',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  blue: {
    name: 'Bleu',
    primary: '#3498db',
    secondary: '#2980b9',
    accent: '#1abc9c',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e9ecef',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
  },
  green: {
    name: 'Vert',
    primary: '#27ae60',
    secondary: '#2ecc71',
    accent: '#16a085',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e9ecef',
    gradient: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
  },
  orange: {
    name: 'Orange',
    primary: '#e67e22',
    secondary: '#f39c12',
    accent: '#d35400',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e9ecef',
    gradient: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)'
  },
  pink: {
    name: 'Rose',
    primary: '#e91e63',
    secondary: '#ad1457',
    accent: '#c2185b',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e9ecef',
    gradient: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)'
  },
  dark: {
    name: 'Sombre',
    primary: '#2c3e50',
    secondary: '#34495e',
    accent: '#1a252f',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e9ecef',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
  },
  rose: {
    name: 'Rose pastel',
    primary: '#f8bbd9',
    secondary: '#f4a6cd',
    accent: '#e8739e',
    background: '#fdf2f8',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#f3e8ff',
    gradient: 'linear-gradient(135deg, #f8bbd9 0%, #f4a6cd 100%)'
  },
  bleu: {
    name: 'Bleu pastel',
    primary: '#a8d8ea',
    secondary: '#91c7e0',
    accent: '#6ba3d6',
    background: '#f0f8ff',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e0f2fe',
    gradient: 'linear-gradient(135deg, #a8d8ea 0%, #91c7e0 100%)'
  },
  vert: {
    name: 'Vert pastel',
    primary: '#b8e6b8',
    secondary: '#a5dba5',
    accent: '#7cc87c',
    background: '#f0fff0',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#e8f5e8',
    gradient: 'linear-gradient(135deg, #b8e6b8 0%, #a5dba5 100%)'
  },
  jaune: {
    name: 'Jaune pastel',
    primary: '#fff3cd',
    secondary: '#ffecb3',
    accent: '#fdd835',
    background: '#fffef7',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#6c757d',
    border: '#fef7cd',
    gradient: 'linear-gradient(135deg, #fff3cd 0%, #ffecb3 100%)'
  }
};

function App() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('purple');
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Mon Document de Travail');
  const [sheet, setSheet] = useState<ReadingSheet>({
    titre: '',
    auteur: '',
    resume: '',
    plan: '',
    temporalites: '',
    pointsVue: '',
    personnages: '',
    registres: '',
    rythme: '',
    figures: '',
    procedes: '',
    lexique: '',
    citations: [{ text: '', page: '' }],
    axes: '',
    tensions: '',
    lectures: '',
    intuitions: '',
    images: '',
    fonction: '',
    references: '',
    biographie: '',
    place: '',
    courants: '',
    contexte: '',
    reception: '',
    oeuvres: '',
    thematiques: '',
    convergence: '',
    glossaire: '',
    notes: '',
    schemas: ''
  });

  const theme = themes[currentTheme];

  useEffect(() => {
    const saved = localStorage.getItem('ficheAnalyse');
    if (saved) {
      setSheet(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ficheAnalyse', JSON.stringify(sheet));
  }, [sheet]);

  const updateField = (field: keyof ReadingSheet, value: string) => {
    setSheet(prev => ({ ...prev, [field]: value }));
  };

  const updateCitation = (index: number, field: 'text' | 'page', value: string) => {
    const newCitations = [...sheet.citations];
    newCitations[index] = { ...newCitations[index], [field]: value };
    setSheet(prev => ({ ...prev, citations: newCitations }));
  };

  const addCitation = () => {
    setSheet(prev => ({
      ...prev,
      citations: [...prev.citations, { text: '', page: '' }]
    }));
  };

  const removeCitation = (index: number) => {
    if (sheet.citations.length > 1) {
      setSheet(prev => ({
        ...prev,
        citations: prev.citations.filter((_, i) => i !== index)
      }));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(sheet, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = `fiche-lecture-${sheet.titre.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    try {
      // Créer un conteneur pour le PDF
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'fixed';
      pdfContainer.style.left = '0';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '210mm';
      pdfContainer.style.padding = '20mm';
      pdfContainer.style.background = theme.background;
      pdfContainer.style.color = theme.text;
      pdfContainer.style.zIndex = '10000';
      pdfContainer.style.boxSizing = 'border-box';
      
      // Chercher le conteneur principal de l'app
      const appContainer = document.querySelector('.max-w-4xl.mx-auto');
      if (!appContainer) {
        alert('Impossible de trouver le contenu à exporter');
        return;
      }
      
      // Créer un clone profond du contenu
      const element = appContainer.cloneNode(true) as HTMLElement;
      
      // Ajouter le titre et l'auteur en haut
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '20px';
      header.style.paddingBottom = '15px';
      header.style.borderBottom = `2px solid ${theme.primary}`;
      header.innerHTML = `
        <h1 style="color: ${theme.primary}; font-size: 24pt; margin: 0 0 10px 0;">
          Fiche de Lecture
        </h1>
        <div style="font-size: 18pt; color: ${theme.text}; margin: 0; font-weight: normal;">
          ${pageTitle || 'Sans titre'}
        </div>
        ${sheet.auteur ? `<div style="color: #666; font-size: 0.9em; margin-top: 5px;">${sheet.auteur}</div>` : ''}
      `;
      
      // Ajouter l'en-tête et le contenu cloné au conteneur PDF
      pdfContainer.appendChild(header);
      pdfContainer.appendChild(element);
      
      // Ajouter le conteneur au corps du document
      document.body.appendChild(pdfContainer);
      
      // Attendre que le DOM soit mis à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Options pour html2canvas
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: theme.background,
        scrollX: 0,
        scrollY: 0,
        width: pdfContainer.offsetWidth,
        height: pdfContainer.scrollHeight,
        windowWidth: pdfContainer.scrollWidth,
        windowHeight: pdfContainer.scrollHeight,
        x: 0,
        y: 0,
        onclone: (clonedDoc: Document) => {
          // S'assurer que les styles sont correctement appliqués
          const style = document.createElement('style');
          style.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              background: ${theme.background} !important;
              color: ${theme.text} !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
            }
            .editable:empty::before {
              color: #999 !important;
              font-style: italic !important;
            }
            .max-w-4xl {
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              background: ${theme.background} !important;
            }
            .section {
              break-inside: avoid;
              page-break-inside: avoid;
              margin-bottom: 20px !important;
            }
            .section-title {
              color: ${theme.primary} !important;
              border-bottom-color: ${theme.primary} !important;
            }
            .editable, .editable[contenteditable="true"] {
              min-height: 1.5em !important;
              border: 1px dashed #ccc !important;
              padding: 8px !important;
              margin: 5px 0 !important;
              border-radius: 4px !important;
              background: ${theme.background === '#ffffff' ? '#f8f9fa' : 'rgba(255,255,255,0.05)'} !important;
            }
            .citations {
              background: ${theme.background === '#ffffff' ? '#f8f9fa' : 'rgba(0,0,0,0.05)'} !important;
              padding: 15px !important;
              border-radius: 8px !important;
              margin: 15px 0 !important;
            }
            .citation {
              border-left: 3px solid ${theme.primary} !important;
              padding-left: 10px !important;
              margin: 10px 0 !important;
            }
            .citation-page {
              background: ${theme.primary} !important;
              color: white !important;
              padding: 2px 8px !important;
              border-radius: 10px !important;
              font-size: 0.8em !important;
              display: inline-block !important;
              margin-top: 5px !important;
            }
            img, .image-upload-zone {
              max-width: 100% !important;
              height: auto !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      };

      // Capturer le contenu avec html2canvas
      const canvas = await html2canvas(pdfContainer as HTMLElement, options as any);

      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculer les dimensions de l'image pour le PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Marge de 10mm de chaque côté
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Ajouter la première page
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight, undefined, 'FAST');

      // Gérer les pages supplémentaires si nécessaire
      const pageHeight = pdf.internal.pageSize.getHeight() - 20; // Marge de 10mm en haut et en bas
      let heightLeft = pdfHeight - pageHeight + 10; // Ajustement pour la marge
      let position = 10; // Marge supérieure
      let page = 1;

      while (heightLeft > 0) {
        pdf.addPage();
        position = -((page * pageHeight) - 10); // Ajuster pour la marge supérieure
        pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        page++;
      }

      // Télécharger le PDF avec un nom de fichier personnalisé
      const fileName = `fiche-lecture-${pageTitle ? pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'sans-titre'}.pdf`;
      pdf.save(fileName);
      
      // Nettoyer
      document.body.removeChild(pdfContainer);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          // Vérifier que les données ont la bonne structure
          if (data && typeof data === 'object') {
            // Fusionner avec la structure par défaut pour éviter les champs manquants
            const defaultSheet: ReadingSheet = {
              titre: '',
              auteur: '',
              resume: '',
              plan: '',
              temporalites: '',
              pointsVue: '',
              personnages: '',
              registres: '',
              rythme: '',
              figures: '',
              procedes: '',
              lexique: '',
              citations: [{ text: '', page: '' }],
              axes: '',
              tensions: '',
              lectures: '',
              intuitions: '',
              images: '',
              fonction: '',
              references: '',
              biographie: '',
              place: '',
              courants: '',
              contexte: '',
              reception: '',
              oeuvres: '',
              thematiques: '',
              convergence: '',
              glossaire: '',
              notes: '',
              schemas: ''
            };
            
            setSheet({ ...defaultSheet, ...data });
            alert('Fiche chargée avec succès !');
          } else {
            alert('Format de fichier invalide');
          }
        } catch (error) {
          alert('Erreur lors de l\'importation du fichier');
        }
      };
      reader.readAsText(file);
    }
    // Réinitialiser l'input pour permettre de recharger le même fichier
    event.target.value = '';
  };

  const ThemeButton = ({ themeKey, isActive }: { themeKey: keyof typeof themes; isActive: boolean }) => (
    <button
      onClick={() => setCurrentTheme(themeKey)}
      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
        isActive ? 'border-gray-800 scale-125 shadow-lg' : 'border-white/80'
      }`}
      style={{ background: themes[themeKey].gradient }}
      title={themes[themeKey].name}
    />
  );

  const exportToWord = async () => {
    try {
      // Create a simple HTML structure for Word export
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Fiche de Lecture - ${pageTitle || 'Sans titre'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #667eea; text-align: center; }
            h2 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
            .section { margin-bottom: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #333; }
            .content { margin-left: 10px; }
            .citation { border-left: 3px solid #667eea; padding-left: 10px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>📖 Fiche de Lecture</h1>
          <h2 style="text-align: center; margin-bottom: 30px;">${pageTitle || 'Sans titre'}</h2>
          ${sheet.auteur ? `<p style="text-align: center; font-style: italic; margin-bottom: 30px;">${sheet.auteur}</p>` : ''}
          
          <div class="section">
            <h2>📘 Résumé & Architecture</h2>
            ${sheet.titre ? `<div class="field"><span class="label">Titre:</span> <span class="content">${sheet.titre}</span></div>` : ''}
            ${sheet.resume ? `<div class="field"><span class="label">Résumé:</span><div class="content">${sheet.resume}</div></div>` : ''}
            ${sheet.plan ? `<div class="field"><span class="label">Plan narratif:</span><div class="content">${sheet.plan}</div></div>` : ''}
            ${sheet.personnages ? `<div class="field"><span class="label">Personnages:</span><div class="content">${sheet.personnages}</div></div>` : ''}
          </div>
          
          ${sheet.citations && sheet.citations.some(c => c.text) ? `
          <div class="section">
            <h2>📝 Citations clés</h2>
            ${sheet.citations.filter(c => c.text).map(citation => `
              <div class="citation">
                <em>"${citation.text}"</em>
                ${citation.page ? ` <small>(p. ${citation.page})</small>` : ''}
              </div>
            `).join('')}
          </div>` : ''}
          
          ${sheet.axes ? `
          <div class="section">
            <h2>🧠 Axes critiques</h2>
            <div class="content">${sheet.axes}</div>
          </div>` : ''}
          
          ${sheet.notes ? `
          <div class="section">
            <h2>📝 Notes</h2>
            <div class="content">${sheet.notes}</div>
          </div>` : ''}
          
          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
            Généré le ${new Date().toLocaleDateString('fr-FR')} par l'application Fiche de Lecture
          </div>
        </body>
        </html>
      `;
      
      // Create a blob with HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fiche-lecture-${pageTitle ? pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'sans-titre'}.html`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Fichier HTML généré avec succès ! Vous pouvez l\'ouvrir dans Word ou tout autre traitement de texte.');
      
    } catch (error) {
      console.error('Erreur lors de la génération du document Word:', error);
      alert('Une erreur est survenue lors de la génération du document Word.');
    }
  };

  // New export functions using the integrated Python scripts
  const exportOptions: ExportOptions = {
    theme,
    pageTitle
  };

  const exportSimplePDF = async () => {
    try {
      const result = exportSimple.pdf(sheet, exportOptions);
      if (result.success && result.data) {
        downloadFile(result.data, result.filename!);
        alert('Fichier PDF simple généré avec succès !');
      } else {
        alert(result.error || 'Erreur lors de la génération du PDF');
      }
    } catch (error) {
      console.error('Error exporting simple PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF simple.');
    }
  };

  const exportSimpleDOCX = async () => {
    try {
      const result = await exportSimple.docx(sheet, exportOptions);
      if (result.success && result.data) {
        downloadFile(result.data, result.filename!);
        alert('Fichier DOCX simple généré avec succès !');
      } else {
        alert(result.error || 'Erreur lors de la génération du DOCX');
      }
    } catch (error) {
      console.error('Error exporting simple DOCX:', error);
      alert('Une erreur est survenue lors de la génération du DOCX simple.');
    }
  };

  const exportModernHTML = () => {
    try {
      const result = exportModern.html(sheet, exportOptions);
      if (result.success && result.data) {
        downloadFile(result.data, result.filename!);
        openFileInNewTab(result.data);
        alert('Fichier HTML moderne généré avec succès !');
      } else {
        alert(result.error || 'Erreur lors de la génération du HTML moderne');
      }
    } catch (error) {
      console.error('Error exporting modern HTML:', error);
      alert('Une erreur est survenue lors de la génération du HTML moderne.');
    }
  };

  const exportWebStyleHTML = () => {
    try {
      const result = exportWebStyle.html(sheet, exportOptions);
      if (result.success && result.data) {
        downloadFile(result.data, result.filename!);
        openFileInNewTab(result.data);
        alert('Fichier HTML web généré avec succès !');
      } else {
        alert(result.error || 'Erreur lors de la génération du HTML web');
      }
    } catch (error) {
      console.error('Error exporting web-style HTML:', error);
      alert('Une erreur est survenue lors de la génération du HTML web.');
    }
  };

  const exportSimpleWebHTML = () => {
    try {
      const result = exportSimpleWeb.html(sheet, exportOptions);
      if (result.success && result.data) {
        downloadFile(result.data, result.filename!);
        openFileInNewTab(result.data);
        alert('Fichier HTML simple généré avec succès !');
      } else {
        alert(result.error || 'Erreur lors de la génération du HTML simple');
      }
    } catch (error) {
      console.error('Error exporting simple web HTML:', error);
      alert('Une erreur est survenue lors de la génération du HTML simple.');
    }
  };

  return (
    <div 
      className="min-h-screen font-serif transition-all duration-300"
      style={{ 
        backgroundColor: theme.background,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        color: theme.text
      }}
    >
      {/* Theme Controls */}
      {isThemeSelectorOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setIsThemeSelectorOpen(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: theme.text }}>
              🎨 Choisir un thème
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {Object.keys(themes).map((themeKey) => (
                <div key={themeKey} className="text-center">
                  <ThemeButton 
                    themeKey={themeKey as keyof typeof themes} 
                    isActive={currentTheme === themeKey} 
                  />
                  <div className="text-xs mt-2" style={{ color: theme.textLight }}>
                    {themes[themeKey as keyof typeof themes].name}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsThemeSelectorOpen(false)}
              className="w-full py-3 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: theme.primary }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Container */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div 
          className="relative text-white text-center py-12 px-8 overflow-hidden"
          style={{ background: theme.gradient }}
        >
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='books' patternUnits='userSpaceOnUse' width='20' height='20'><rect width='20' height='20' fill='none'/><path d='M2 2h16v16H2z' fill='rgba(255,255,255,0.1)'/></pattern></defs><rect width='100' height='100' fill='url(%23books)'/></svg>")`,
              backgroundRepeat: 'repeat'
            }}
          />
          <h1 className="text-4xl font-bold mb-2 relative z-10">
              📖 Fiche de Lecture
            </h1>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="text-xl bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none w-full max-w-2xl text-center"
              style={{ color: theme.text }}
              placeholder="Titre du document"
            />
        </div>

        {/* Content */}
        <div className="p-10">
          {/* Export/Import Controls */}
          <div className="flex justify-end gap-3 mb-8 flex-wrap">
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 hover:opacity-80 shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                <span>📤 Exporter</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Export Standard
                  </div>
                  <button
                    onClick={exportToPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📄 Exporter en PDF (Standard)
                  </button>
                  <button
                    onClick={exportToWord}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📝 Exporter en DOCX (Standard)
                  </button>
                  <button
                    onClick={exportData}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    💾 Exporter en JSON
                  </button>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Export Templates Python
                  </div>
                  <button
                    onClick={exportSimplePDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📄 PDF Simple (Python)
                  </button>
                  <button
                    onClick={exportSimpleDOCX}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📝 DOCX Simple (Python)
                  </button>
                  <button
                    onClick={exportModernHTML}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🌐 HTML Moderne (Python)
                  </button>
                  <button
                    onClick={exportWebStyleHTML}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🎨 HTML Web Style (Python)
                  </button>
                  <button
                    onClick={exportSimpleWebHTML}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🌍 HTML Simple Web (Python)
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => document.getElementById('import-json')?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 hover:opacity-80 shadow-lg"
              style={{ backgroundColor: theme.secondary }}
            >
              <span>📥 Importer</span>
              <input
                type="file"
                id="import-json"
                accept=".json"
                className="hidden"
                onChange={importData}
              />
            </button>
            <button
              onClick={() => setIsThemeSelectorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 hover:opacity-80 shadow-lg"
              style={{ backgroundColor: theme.accent }}
            >
              🎨 Thème
            </button>
          </div>

          {/* Section 1: Résumé & Architecture */}
          <div 
            className="mb-8 border-l-4 pl-5 transition-all duration-300 hover:translate-x-1"
            style={{ borderColor: theme.primary }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              📘 Résumé & Architecture
            </h2>
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 5px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Titre de l'œuvre
                  </label>
                  <input
                    type="text"
                    value={sheet.titre}
                    onChange={(e) => updateField('titre', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Titre de l'œuvre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Auteur·ice / Édition utilisée
                  </label>
                  <input
                    type="text"
                    value={sheet.auteur}
                    onChange={(e) => updateField('auteur', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Auteur et édition"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Image de couverture ou portrait d'auteur
                </label>
                <ImageUploadZone label="une image de couverture" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Résumé détaillé
                </label>
                <textarea
                  value={sheet.resume}
                  onChange={(e) => updateField('resume', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Résumé détaillé de l'œuvre..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Plan narratif / Architecture
                  </label>
                  <textarea
                    value={sheet.plan}
                    onChange={(e) => updateField('plan', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Structure de l'œuvre..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Temporalités (ordre, vitesse, ellipses)
                  </label>
                  <textarea
                    value={sheet.temporalites}
                    onChange={(e) => updateField('temporalites', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Analyse temporelle..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Points de vue / focalisation
                  </label>
                  <textarea
                    value={sheet.pointsVue}
                    onChange={(e) => updateField('pointsVue', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Narrateur, focalisation..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Système des personnages
                  </label>
                  <textarea
                    value={sheet.personnages}
                    onChange={(e) => updateField('personnages', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Personnages principaux..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Registres, tonalités, leitmotive
                  </label>
                  <textarea
                    value={sheet.registres}
                    onChange={(e) => updateField('registres', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Registres dominants..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Rythme narratif
                </label>
                <textarea
                  value={sheet.rythme}
                  onChange={(e) => updateField('rythme', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Analyse du rythme..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Analyse stylistique */}
          <div 
            className="mb-8 border-l-4 pl-5 transition-all duration-300 hover:translate-x-1"
            style={{ borderColor: theme.primary }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              🖋️ Analyse stylistique / de détail
            </h2>
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 5px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Figures de style marquantes
                  </label>
                  <textarea
                    value={sheet.figures}
                    onChange={(e) => updateField('figures', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Métaphores, comparaisons, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Procédés récurrents
                  </label>
                  <textarea
                    value={sheet.procedes}
                    onChange={(e) => updateField('procedes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Procédés stylistiques..."
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Lexique spécifique / glossaire
                </label>
                <textarea
                  value={sheet.lexique}
                  onChange={(e) => updateField('lexique', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Vocabulaire particulier, termes techniques..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold" style={{ color: theme.textLight }}>
                    Citations clés
                  </label>
                  <button
                    onClick={addCitation}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-white transition-all duration-200 hover:opacity-80"
                    style={{ backgroundColor: theme.accent }}
                  >
                    <Plus size={16} />
                    Ajouter
                  </button>
                </div>
                <div 
                  className="border-2 border-dashed p-5 rounded-lg"
                  style={{ borderColor: theme.border, backgroundColor: 'white' }}
                >
                  {sheet.citations.map((citation, index) => (
                    <div key={index} className="flex gap-3 items-start mb-4 last:mb-0">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={citation.text}
                          onChange={(e) => updateCitation(index, 'text', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text
                          }}
                          placeholder="« Citation importante... »"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="text"
                          value={citation.page}
                          onChange={(e) => updateCitation(index, 'page', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text
                          }}
                          placeholder="p. 000"
                        />
                      </div>
                      {sheet.citations.length > 1 && (
                        <button
                          onClick={() => removeCitation(index)}
                          className="p-2 rounded-lg transition-all duration-200 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Problématiques & Enjeux */}
          <div 
            className="mb-8 border-l-4 pl-5 transition-all duration-300 hover:translate-x-1"
            style={{ borderColor: theme.primary }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              🧠 Problématiques & Enjeux
            </h2>
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 5px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Axes critiques principaux
                  </label>
                  <textarea
                    value={sheet.axes}
                    onChange={(e) => updateField('axes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Principales orientations critiques..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Tensions internes à l'œuvre
                  </label>
                  <textarea
                    value={sheet.tensions}
                    onChange={(e) => updateField('tensions', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Contradictions, ambiguïtés..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Lectures possibles / débats critiques
                  </label>
                  <textarea
                    value={sheet.lectures}
                    onChange={(e) => updateField('lectures', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Différentes interprétations..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Intuitions personnelles de lecture
                  </label>
                  <textarea
                    value={sheet.intuitions}
                    onChange={(e) => updateField('intuitions', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Vos réflexions personnelles..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Images dans l'œuvre */}
          <div 
            className="mb-8 border-l-4 pl-5 transition-all duration-300 hover:translate-x-1"
            style={{ borderColor: theme.primary }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              🖼️ Images dans l'œuvre
            </h2>
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 5px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Illustrations ou références visuelles
                </label>
                <ImageUploadZone label="des images illustrant l'œuvre" />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Origine / rôle des images
                  </label>
                  <textarea
                    value={sheet.images}
                    onChange={(e) => updateField('images', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="D'où viennent les images..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Fonction narrative ou symbolique
                  </label>
                  <textarea
                    value={sheet.fonction}
                    onChange={(e) => updateField('fonction', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Rôle dans le récit..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Références culturelles associées
                  </label>
                  <textarea
                    value={sheet.references}
                    onChange={(e) => updateField('references', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Références artistiques..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold mb-2" style={{ color: theme.textLight }}>
                    Liens utiles
                  </h4>
                  <LinkManager sectionKey="images-links" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Contexte & Perspectives */}
          <div 
            className="mb-8 border-l-4 pl-5 transition-all duration-300 hover:translate-x-1"
            style={{ borderColor: theme.primary }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              🔍 Contexte & Perspectives
            </h2>
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 5px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Documents historiques ou contextuels
                </label>
                <ImageUploadZone label="des documents d'époque, cartes, etc." />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Biographie de l'auteur·ice
                  </label>
                  <textarea
                    value={sheet.biographie}
                    onChange={(e) => updateField('biographie', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Éléments biographiques pertinents..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Place de l'œuvre dans son parcours
                  </label>
                  <textarea
                    value={sheet.place}
                    onChange={(e) => updateField('place', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Contexte de création..."
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Courants littéraires / artistiques associés
                </label>
                <textarea
                  value={sheet.courants}
                  onChange={(e) => updateField('courants', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Mouvements, écoles, influences..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Références historiques, philosophiques, critiques
                  </label>
                  <textarea
                    value={sheet.contexte}
                    onChange={(e) => updateField('contexte', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Contexte intellectuel..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Réception critique
                  </label>
                  <textarea
                    value={sheet.reception}
                    onChange={(e) => updateField('reception', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Accueil de l'œuvre..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Comparatisme */}
          <div 
            className="mb-8 border-l-4 pl-5 transition-all duration-300 hover:translate-x-1"
            style={{ borderColor: theme.primary }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              🔄 Comparatisme
            </h2>
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 5px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Œuvres en regard dans le programme
                </label>
                <textarea
                  value={sheet.oeuvres}
                  onChange={(e) => updateField('oeuvres', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Autres œuvres du programme..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Thématiques ou procédés communs
                  </label>
                  <textarea
                    value={sheet.thematiques}
                    onChange={(e) => updateField('thematiques', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Points de convergence..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                    Éléments de convergence ou divergence
                  </label>
                  <textarea
                    value={sheet.convergence}
                    onChange={(e) => updateField('convergence', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="Similitudes et différences..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Annexes */}
          <div 
            className="mb-8 border-l-4 pl-5 transition-all duration-300 hover:translate-x-1"
            style={{ borderColor: theme.primary }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              📂 Annexes
            </h2>
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 5px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Schémas, tableaux ou cartes mentales
                </label>
                <ImageUploadZone label="vos schémas et tableaux" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Glossaire personnel
                </label>
                <textarea
                  value={sheet.glossaire}
                  onChange={(e) => updateField('glossaire', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Définitions, termes techniques..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: theme.textLight }}>
                  Notes ou remarques libres
                </label>
                <textarea
                  value={sheet.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-vertical"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Réflexions supplémentaires, idées..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8" style={{ color: theme.textLight }}>
            <p className="text-sm">
              Fiche de lecture sauvegardée automatiquement • 
              Utilisez les boutons Sauvegarder/Charger pour partager vos fiches
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: '#4CAF50' }}
        >
          📄 PDF
        </button>
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: theme.primary }}
        >
          <Save size={20} />
          💾
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: theme.secondary }}
        >
          <Printer size={20} />
          🖨️
        </button>
      </div>
    </div>
  );
}

export default App;
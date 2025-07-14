import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { exportSimple, exportModern, exportWebStyle, exportSimpleWeb, ExportOptions } from './exports';
import { downloadFile, openFileInNewTab } from './exports/utils';
import CustomThemeCreator from './components/CustomThemeCreator';
import TabManager from './components/TabManager';
import { useCustomThemes } from './hooks/useCustomThemes';
import { ReadingSheet } from './components/sections/SectionComponents';

// Link Manager Component
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
          <Plus size={16} />
          Ajouter un lien
        </button>
      )}
    </div>
  );
};

// Decorative components for themes
const BulletDecorations = ({ theme }: { theme: any }) => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute top-10 left-10 w-8 h-8 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: theme.primary }}></div>
    <div className="absolute top-32 right-20 w-6 h-6 rounded-full opacity-15 animate-pulse" style={{ backgroundColor: theme.secondary, animationDelay: '0.5s' }}></div>
    <div className="absolute bottom-20 left-20 w-4 h-4 rounded-full opacity-25 animate-pulse" style={{ backgroundColor: theme.accent, animationDelay: '1s' }}></div>
    <div className="absolute bottom-40 right-10 w-10 h-10 rounded-full opacity-10 animate-pulse" style={{ backgroundColor: theme.primary, animationDelay: '1.5s' }}></div>
    <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: theme.secondary, animationDelay: '2s' }}></div>
  </div>
);

const VintageDecorations = ({ theme }: { theme: any }) => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute top-16 left-16 w-12 h-12 border-2 opacity-15 rotate-45 animate-spin" style={{ borderColor: theme.primary, animationDuration: '20s' }}></div>
    <div className="absolute top-40 right-24 w-8 h-8 rounded-full opacity-20 animate-bounce" style={{ backgroundColor: theme.secondary, animationDuration: '3s' }}></div>
    <div className="absolute bottom-32 left-12 w-16 h-1 opacity-25 animate-pulse" style={{ backgroundColor: theme.accent, animationDelay: '1s' }}></div>
    <div className="absolute bottom-16 right-16 w-10 h-10 opacity-15 rotate-12 animate-pulse" style={{ backgroundColor: theme.primary, animationDelay: '2s' }}></div>
    <div className="absolute top-1/3 right-1/3 w-6 h-6 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: theme.secondary, animationDelay: '3s' }}></div>
  </div>
);

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
  },
  bulletJournal: {
    name: 'Bullet Journal',
    primary: '#F9A825',
    secondary: '#E57373',
    accent: '#4FC3F7',
    background: '#FFFDF7',
    card: '#ffffff',
    text: '#444444',
    textLight: '#666666',
    border: '#f0f0f0',
    gradient: 'linear-gradient(135deg, #F9A825 0%, #E57373 100%)',
    titleFont: 'Caveat, cursive',
    textFont: 'Quicksand, sans-serif'
  },
  livreVintage: {
    name: 'Livre Vintage',
    primary: '#8D6E63',
    secondary: '#C5A880',
    accent: '#A1887F',
    background: '#FAF3E0',
    card: '#ffffff',
    text: '#3B3A30',
    textLight: '#5D4E37',
    border: '#E0D4B8',
    gradient: 'linear-gradient(135deg, #8D6E63 0%, #C5A880 100%)',
    titleFont: 'Playfair Display, serif',
    textFont: 'EB Garamond, serif'
  }
};

function App() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes | 'custom'>('purple');
  const [customThemeData, setCustomThemeData] = useState<any>(null);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [showCustomThemeCreator, setShowCustomThemeCreator] = useState(false);
  const { customThemes } = useCustomThemes();
  
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

  const theme = currentTheme === 'custom' && customThemeData ? customThemeData : themes[currentTheme as keyof typeof themes];

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
      // Get tab manager element to access tabs
      const tabManagerElement = document.querySelector('[data-testid="tab-manager"]') as HTMLElement;
      if (!tabManagerElement) {
        alert('Impossible de trouver le gestionnaire d\'onglets');
        return;
      }

      // Get tabs from the useDynamicTabs hook - use the DEFAULT_TABS structure
      const defaultTabs = [
        { id: 'resume-architecture', title: 'Résumé & Architecture', icon: '📘' },
        { id: 'analyse-stylistique', title: 'Analyse stylistique', icon: '🖋️' },
        { id: 'problematiques-enjeux', title: 'Problématiques & Enjeux', icon: '🧠' },
        { id: 'images-oeuvre', title: 'Images dans l\'œuvre', icon: '🖼️' },
        { id: 'contexte-perspectives', title: 'Contexte & Perspectives', icon: '🔍' },
        { id: 'comparatisme', title: 'Comparatisme', icon: '🔄' },
        { id: 'annexes', title: 'Annexes', icon: '📂' }
      ];

      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // PDF page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 15; // 15mm margins
      const marginY = 20; // 20mm margins
      const contentWidth = pageWidth - (marginX * 2);
      const contentHeight = pageHeight - (marginY * 2);

      // Create temporary container for each tab
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '0';
      tempContainer.style.top = '0';
      tempContainer.style.width = `${contentWidth}mm`;
      tempContainer.style.height = `${contentHeight}mm`;
      tempContainer.style.backgroundColor = theme.background;
      tempContainer.style.color = theme.text;
      tempContainer.style.fontFamily = theme.textFont || 'serif';
      tempContainer.style.zIndex = '10000';
      tempContainer.style.padding = '0';
      tempContainer.style.boxSizing = 'border-box';
      tempContainer.style.overflow = 'hidden';

      // Apply background image if exists
      if (theme.backgroundImage) {
        tempContainer.style.backgroundImage = `url(${theme.backgroundImage})`;
        tempContainer.style.backgroundSize = 'cover';
        tempContainer.style.backgroundPosition = 'center';
        tempContainer.style.backgroundRepeat = 'no-repeat';
      }

      document.body.appendChild(tempContainer);

      // Process each tab
      for (let i = 0; i < defaultTabs.length; i++) {
        const tab = defaultTabs[i];
        const isFirstPage = i === 0;

        // Create page content
        const pageContent = document.createElement('div');
        pageContent.style.width = '100%';
        pageContent.style.height = '100%';
        pageContent.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        pageContent.style.padding = '20mm';
        pageContent.style.boxSizing = 'border-box';
        pageContent.style.position = 'relative';
        pageContent.style.display = 'flex';
        pageContent.style.flexDirection = 'column';

        // Add background overlay for better text readability
        if (theme.backgroundImage) {
          const overlay = document.createElement('div');
          overlay.style.position = 'absolute';
          overlay.style.inset = '0';
          overlay.style.backgroundColor = theme.background;
          overlay.style.opacity = String(1 - (theme.backgroundImageOpacity || 0.1));
          overlay.style.pointerEvents = 'none';
          pageContent.appendChild(overlay);
        }

        // Add page header
        const pageHeader = document.createElement('div');
        pageHeader.style.position = 'relative';
        pageHeader.style.zIndex = '10';
        pageHeader.style.marginBottom = '20px';
        pageHeader.style.paddingBottom = '15px';
        pageHeader.style.borderBottom = `2px solid ${theme.primary}`;
        pageHeader.style.textAlign = 'center';

        if (isFirstPage) {
          // Full header for first page
          pageHeader.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
              <span style="font-size: 28px;">📖</span>
              <h1 style="color: ${theme.primary}; font-size: 24pt; margin: 0; font-weight: bold; font-family: ${theme.titleFont || 'serif'};">
                Fiche de Lecture
              </h1>
            </div>
            <div style="font-size: 18pt; color: ${theme.text}; margin: 0; font-weight: normal; font-family: ${theme.titleFont || 'serif'};">
              ${sheet.titre || 'Sans titre'}
            </div>
            ${sheet.auteur ? `<div style="color: ${theme.textLight}; font-size: 14pt; margin-top: 8px; font-style: italic;">${sheet.auteur}</div>` : ''}
          `;
        } else {
          // Simplified header for subsequent pages
          pageHeader.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="font-size: 14pt; color: ${theme.textLight}; font-style: italic;">
                ${sheet.titre || 'Sans titre'}
              </div>
              <div style="font-size: 12pt; color: ${theme.textLight};">
                Page ${i + 1}
              </div>
            </div>
          `;
        }

        // Add tab title
        const tabTitle = document.createElement('div');
        tabTitle.style.position = 'relative';
        tabTitle.style.zIndex = '10';
        tabTitle.style.display = 'flex';
        tabTitle.style.alignItems = 'center';
        tabTitle.style.gap = '12px';
        tabTitle.style.margin = '20px 0';
        tabTitle.style.padding = '15px 20px';
        tabTitle.style.backgroundColor = `${theme.primary}15`;
        tabTitle.style.borderRadius = '10px';
        tabTitle.style.borderLeft = `4px solid ${theme.primary}`;
        tabTitle.innerHTML = `
          <span style="font-size: 24px; min-width: 30px;">${tab.icon}</span>
          <h2 style="color: ${theme.primary}; font-size: 20pt; margin: 0; font-weight: bold; font-family: ${theme.titleFont || 'serif'};">
            ${tab.title}
          </h2>
        `;

        // Add tab content
        const tabContentDiv = document.createElement('div');
        tabContentDiv.style.position = 'relative';
        tabContentDiv.style.zIndex = '10';
        tabContentDiv.style.flex = '1';
        tabContentDiv.style.overflow = 'hidden';
        tabContentDiv.style.fontSize = '12pt';
        tabContentDiv.style.lineHeight = '1.6';

        // Get actual tab content
        const actualTabContent = getTabContentForPDF(tab.id);
        if (actualTabContent) {
          tabContentDiv.appendChild(actualTabContent);
        }

        // Add page footer
        const pageFooter = document.createElement('div');
        pageFooter.style.position = 'relative';
        pageFooter.style.zIndex = '10';
        pageFooter.style.marginTop = '20px';
        pageFooter.style.paddingTop = '15px';
        pageFooter.style.borderTop = `1px solid ${theme.border}`;
        pageFooter.style.textAlign = 'center';
        pageFooter.style.color = theme.textLight;
        pageFooter.style.fontSize = '10pt';
        pageFooter.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>📖 Fiche de Lecture</span>
            <span>Généré le ${new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        `;

        // Assemble page
        pageContent.appendChild(pageHeader);
        pageContent.appendChild(tabTitle);
        pageContent.appendChild(tabContentDiv);
        pageContent.appendChild(pageFooter);

        // Clear container and add new page content
        tempContainer.innerHTML = '';
        tempContainer.appendChild(pageContent);

        // Wait for content to render
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture page with html2canvas
        const canvas = await html2canvas(tempContainer, {
          width: tempContainer.offsetWidth,
          height: tempContainer.offsetHeight,
          backgroundColor: theme.background,
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          foreignObjectRendering: true,
          onclone: (clonedDoc: Document) => {
            // Add styles to ensure proper rendering
            const style = document.createElement('style');
            style.textContent = `
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
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
              .pdf-section {
                margin-bottom: 20px !important;
                padding: 15px !important;
                background: rgba(255, 255, 255, 0.8) !important;
                border-radius: 8px !important;
                border: 1px solid ${theme.border} !important;
              }
              .pdf-section-title {
                color: ${theme.primary} !important;
                font-size: 14pt !important;
                font-weight: bold !important;
                margin-bottom: 10px !important;
                border-bottom: 1px solid ${theme.primary} !important;
                padding-bottom: 5px !important;
              }
              .pdf-section-content {
                color: ${theme.text} !important;
                font-size: 11pt !important;
                line-height: 1.5 !important;
                min-height: 40px !important;
                white-space: pre-wrap !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        });

        // Add page to PDF
        if (i > 0) {
          pdf.addPage();
        }

        // Convert canvas to image and add to PDF
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', marginX, marginY, contentWidth, contentHeight, undefined, 'FAST');
      }

      // Save PDF
      const fileName = `fiche-lecture-${sheet.titre ? sheet.titre.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'sans-titre'}.pdf`;
      pdf.save(fileName);

      // Clean up
      document.body.removeChild(tempContainer);

      alert(`PDF généré avec succès ! ${defaultTabs.length} pages créées avec design préservé.`);

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
      onClick={() => {
        setCurrentTheme(themeKey);
        setCustomThemeData(null);
      }}
      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
        isActive ? 'border-gray-800 scale-125 shadow-lg' : 'border-white/80'
      }`}
      style={{ background: themes[themeKey].gradient }}
      title={themes[themeKey].name}
    />
  );

  const CustomThemeButton = ({ theme, isActive }: { theme: any; isActive: boolean }) => (
    <button
      onClick={() => {
        setCurrentTheme('custom');
        setCustomThemeData(theme);
      }}
      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
        isActive ? 'border-gray-800 scale-125 shadow-lg' : 'border-white/80'
      }`}
      style={{ background: theme.gradient }}
      title={theme.name}
    />
  );

  const handleThemeChange = (newTheme: any) => {
    setCurrentTheme('custom');
    setCustomThemeData(newTheme);
  };

  const exportToWord = async () => {
    try {
      // Create a simple HTML structure for Word export
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Fiche de Lecture - ${sheet.titre || 'Sans titre'}</title>
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
          <h2 style="text-align: center; margin-bottom: 30px;">${sheet.titre || 'Sans titre'}</h2>
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
      link.download = `fiche-lecture-${sheet.titre ? sheet.titre.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'sans-titre'}.html`;
      
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
  const exportSimplePDF = async () => {
    try {
      const exportOptions: ExportOptions = {
        theme,
        pageTitle: sheet.titre
      };
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
      const exportOptions: ExportOptions = {
        theme,
        pageTitle: sheet.titre
      };
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
      const exportOptions: ExportOptions = {
        theme,
        pageTitle: sheet.titre
      };
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
      const exportOptions: ExportOptions = {
        theme,
        pageTitle: sheet.titre
      };
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
      const exportOptions: ExportOptions = {
        theme,
        pageTitle: sheet.titre
      };
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

  // Export to JPG/PNG functions with enhanced design
  const exportToImages = async (format: 'jpeg' | 'png') => {
    try {
      const zip = new JSZip();
      
      // Get tab manager component to access tabs
      const tabManagerElement = document.querySelector('[data-testid="tab-manager"]') as HTMLElement;
      if (!tabManagerElement) {
        alert('Impossible de trouver le gestionnaire d\'onglets');
        return;
      }

      // Get tabs from the useDynamicTabs hook - we need to access the actual tab data
      // For now, we'll use the default tabs structure
      const defaultTabs = [
        { id: 'resume-architecture', title: 'Résumé & Architecture', icon: '📘' },
        { id: 'analyse-stylistique', title: 'Analyse stylistique', icon: '🖋️' },
        { id: 'problematiques-enjeux', title: 'Problématiques & Enjeux', icon: '🧠' },
        { id: 'images-oeuvre', title: 'Images dans l\'œuvre', icon: '🖼️' },
        { id: 'contexte-perspectives', title: 'Contexte & Perspectives', icon: '🔍' },
        { id: 'comparatisme', title: 'Comparatisme', icon: '🔄' },
        { id: 'annexes', title: 'Annexes', icon: '📂' }
      ];

      // Create a temporary container for capturing tab content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '0';
      tempContainer.style.top = '0';
      tempContainer.style.width = '1200px';
      tempContainer.style.minHeight = '1600px';
      tempContainer.style.backgroundColor = theme.background;
      tempContainer.style.color = theme.text;
      tempContainer.style.fontFamily = theme.textFont || 'serif';
      tempContainer.style.zIndex = '10000';
      tempContainer.style.padding = '0';
      tempContainer.style.boxSizing = 'border-box';
      
      // Apply background image if exists with proper opacity
      if (theme.backgroundImage) {
        tempContainer.style.backgroundImage = `url(${theme.backgroundImage})`;
        tempContainer.style.backgroundSize = 'cover';
        tempContainer.style.backgroundPosition = 'center';
        tempContainer.style.backgroundRepeat = 'no-repeat';
        tempContainer.style.position = 'relative';
        
        // Add overlay for background opacity
        const bgOverlay = document.createElement('div');
        bgOverlay.style.position = 'absolute';
        bgOverlay.style.inset = '0';
        bgOverlay.style.backgroundColor = theme.background;
        bgOverlay.style.opacity = String(1 - (theme.backgroundImageOpacity || 0.1));
        bgOverlay.style.pointerEvents = 'none';
        tempContainer.appendChild(bgOverlay);
      }
      
      document.body.appendChild(tempContainer);

      // For each tab, capture it as an image
      for (let i = 0; i < defaultTabs.length; i++) {
        const tab = defaultTabs[i];
        
        // Create enhanced tab content with better design
        const tabContent = document.createElement('div');
        tabContent.style.width = '100%';
        tabContent.style.minHeight = '1500px';
        tabContent.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        tabContent.style.padding = '60px';
        tabContent.style.borderRadius = '20px';
        tabContent.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        tabContent.style.margin = '40px';
        tabContent.style.position = 'relative';
        tabContent.style.overflow = 'hidden';
        
        // Add decorative elements
        const decorativeHeader = document.createElement('div');
        decorativeHeader.style.position = 'absolute';
        decorativeHeader.style.top = '0';
        decorativeHeader.style.left = '0';
        decorativeHeader.style.right = '0';
        decorativeHeader.style.height = '8px';
        decorativeHeader.style.background = theme.gradient;
        decorativeHeader.style.borderRadius = '20px 20px 0 0';
        tabContent.appendChild(decorativeHeader);
        
        // Add app branding header
        const brandingHeader = document.createElement('div');
        brandingHeader.style.textAlign = 'center';
        brandingHeader.style.marginBottom = '40px';
        brandingHeader.style.padding = '20px 0';
        brandingHeader.style.borderBottom = `2px solid ${theme.primary}`;
        brandingHeader.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
            <span style="font-size: 36px;">📖</span>
            <h1 style="color: ${theme.primary}; font-size: 32px; margin: 0; font-weight: bold; font-family: ${theme.titleFont || 'serif'};">
              Fiche de Lecture
            </h1>
          </div>
          <div style="font-size: 18px; color: ${theme.text}; margin: 0; font-weight: normal;">
            ${sheet.titre || 'Sans titre'}
          </div>
          ${sheet.auteur ? `<div style="color: ${theme.textLight}; font-size: 14px; margin-top: 8px; font-style: italic;">${sheet.auteur}</div>` : ''}
        `;
        tabContent.appendChild(brandingHeader);
        
        // Add tab header with enhanced design
        const tabHeader = document.createElement('div');
        tabHeader.style.display = 'flex';
        tabHeader.style.alignItems = 'center';
        tabHeader.style.gap = '15px';
        tabHeader.style.marginBottom = '40px';
        tabHeader.style.padding = '20px';
        tabHeader.style.background = `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`;
        tabHeader.style.borderRadius = '15px';
        tabHeader.style.border = `2px solid ${theme.primary}30`;
        
        const tabIcon = document.createElement('div');
        tabIcon.style.fontSize = '36px';
        tabIcon.style.minWidth = '50px';
        tabIcon.textContent = tab.icon;
        
        const tabTitle = document.createElement('h1');
        tabTitle.style.fontSize = '28px';
        tabTitle.style.fontWeight = 'bold';
        tabTitle.style.color = theme.primary;
        tabTitle.style.margin = '0';
        tabTitle.style.fontFamily = theme.titleFont || 'serif';
        tabTitle.textContent = tab.title;
        
        tabHeader.appendChild(tabIcon);
        tabHeader.appendChild(tabTitle);
        tabContent.appendChild(tabHeader);
        
        // Add tab body content with enhanced styling
        const tabBody = document.createElement('div');
        tabBody.style.lineHeight = '1.8';
        tabBody.style.fontSize = '16px';
        
        // Get the actual tab content based on tab ID
        const actualTabContent = getTabContentForExport(tab.id);
        if (actualTabContent) {
          tabBody.appendChild(actualTabContent);
        }
        
        tabContent.appendChild(tabBody);
        
        // Add footer with app info
        const footer = document.createElement('div');
        footer.style.marginTop = '60px';
        footer.style.textAlign = 'center';
        footer.style.padding = '20px';
        footer.style.color = theme.textLight;
        footer.style.fontSize = '12px';
        footer.style.borderTop = `1px solid ${theme.border}`;
        footer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>📖</span>
            <span>Généré le ${new Date().toLocaleDateString('fr-FR')} par l'application Fiche de Lecture</span>
          </div>
        `;
        tabContent.appendChild(footer);
        
        // Clear previous content and add new tab content
        tempContainer.innerHTML = '';
        if (theme.backgroundImage) {
          // Re-add background overlay
          const bgOverlay = document.createElement('div');
          bgOverlay.style.position = 'absolute';
          bgOverlay.style.inset = '0';
          bgOverlay.style.backgroundColor = theme.background;
          bgOverlay.style.opacity = String(1 - (theme.backgroundImageOpacity || 0.1));
          bgOverlay.style.pointerEvents = 'none';
          tempContainer.appendChild(bgOverlay);
        }
        tempContainer.appendChild(tabContent);
        
        // Wait for content to render
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Capture the tab as image with better quality
        const canvas = await html2canvas(tempContainer, {
          width: 1200,
          height: 1600,
          backgroundColor: theme.background,
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          foreignObjectRendering: true,
          imageTimeout: 15000
        });
        
        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, `image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
        });
        
        // Add to zip
        const tabName = tab.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${String(i + 1).padStart(2, '0')}-${tabName}.${format}`;
        zip.file(fileName, blob);
      }
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const fileName = `fiche-lecture-${sheet.titre.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled'}-${format}.zip`;
      downloadFile(zipBlob, fileName);
      
      alert(`Export ${format.toUpperCase()} terminé ! ${defaultTabs.length} images générées avec design amélioré.`);
      
    } catch (error) {
      console.error('Error exporting to images:', error);
      alert(`Une erreur est survenue lors de l'export en ${format.toUpperCase()}`);
    }
  };

  // Helper function to get tab content for PDF export with optimized styling
  const getTabContentForPDF = (tabId: string): HTMLElement | null => {
    const contentDiv = document.createElement('div');
    contentDiv.style.height = '100%';
    contentDiv.style.overflow = 'hidden';
    
    const createPDFSection = (title: string, content: string, isMain = false) => {
      const section = document.createElement('div');
      section.className = 'pdf-section';
      section.style.marginBottom = '20px';
      section.style.padding = '15px';
      section.style.backgroundColor = isMain ? `${theme.primary}15` : 'rgba(255, 255, 255, 0.8)';
      section.style.borderRadius = '8px';
      section.style.border = `1px solid ${theme.border}`;
      
      if (isMain) {
        section.style.borderLeft = `4px solid ${theme.primary}`;
      }
      
      const titleElement = document.createElement('h3');
      titleElement.className = 'pdf-section-title';
      titleElement.style.color = theme.primary;
      titleElement.style.marginBottom = '10px';
      titleElement.style.fontSize = '14pt';
      titleElement.style.fontWeight = 'bold';
      titleElement.style.fontFamily = theme.titleFont || 'serif';
      titleElement.style.borderBottom = `1px solid ${theme.primary}`;
      titleElement.style.paddingBottom = '5px';
      titleElement.textContent = title;
      
      const contentElement = document.createElement('div');
      contentElement.className = 'pdf-section-content';
      contentElement.style.color = theme.text;
      contentElement.style.fontSize = '11pt';
      contentElement.style.lineHeight = '1.5';
      contentElement.style.minHeight = '40px';
      contentElement.style.whiteSpace = 'pre-wrap';
      contentElement.style.fontFamily = theme.textFont || 'serif';
      contentElement.textContent = content || 'Non renseigné';
      
      section.appendChild(titleElement);
      section.appendChild(contentElement);
      return section;
    };
    
    switch (tabId) {
      case 'resume-architecture':
        contentDiv.appendChild(createPDFSection('Titre de l\'œuvre', sheet.titre || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Auteur', sheet.auteur || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Résumé détaillé', sheet.resume || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Plan narratif / Architecture', sheet.plan || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Temporalités', sheet.temporalites || 'Non renseigné'));
        break;
      case 'analyse-stylistique':
        contentDiv.appendChild(createPDFSection('Points de vue / Focalisation', sheet.pointsVue || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Système des personnages', sheet.personnages || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Registres, tonalités, leitmotive', sheet.registres || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Rythme narratif', sheet.rythme || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Figures de style', sheet.figures || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Procédés stylistiques', sheet.procedes || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Lexique', sheet.lexique || 'Non renseigné'));
        break;
      case 'problematiques-enjeux':
        contentDiv.appendChild(createPDFSection('Axes d\'analyse', sheet.axes || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Tensions et conflits', sheet.tensions || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Lectures critiques', sheet.lectures || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Intuitions personnelles', sheet.intuitions || 'Non renseigné'));
        
        // Add citations section with special styling
        if (sheet.citations && sheet.citations.some(c => c.text)) {
          const citationsDiv = document.createElement('div');
          citationsDiv.className = 'citations';
          citationsDiv.style.marginBottom = '20px';
          citationsDiv.style.padding = '15px';
          citationsDiv.style.backgroundColor = `${theme.secondary}15`;
          citationsDiv.style.borderRadius = '8px';
          citationsDiv.style.border = `1px solid ${theme.secondary}30`;
          citationsDiv.style.borderLeft = `4px solid ${theme.secondary}`;
          
          const citationsTitle = document.createElement('h3');
          citationsTitle.style.color = theme.secondary;
          citationsTitle.style.marginBottom = '10px';
          citationsTitle.style.fontSize = '14pt';
          citationsTitle.style.fontWeight = 'bold';
          citationsTitle.style.borderBottom = `1px solid ${theme.secondary}`;
          citationsTitle.style.paddingBottom = '5px';
          citationsTitle.textContent = 'Citations clés';
          citationsDiv.appendChild(citationsTitle);
          
          sheet.citations.filter(c => c.text).forEach(citation => {
            const citationBlock = document.createElement('div');
            citationBlock.className = 'citation';
            citationBlock.style.marginBottom = '10px';
            citationBlock.style.padding = '10px';
            citationBlock.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            citationBlock.style.borderRadius = '6px';
            citationBlock.style.borderLeft = `3px solid ${theme.secondary}`;
            citationBlock.style.fontSize = '10pt';
            citationBlock.style.fontStyle = 'italic';
            citationBlock.style.lineHeight = '1.4';
            citationBlock.innerHTML = `
              <div style="color: ${theme.text}; margin-bottom: 5px;">"${citation.text}"</div>
              ${citation.page ? `<div style="color: ${theme.textLight}; font-size: 9pt; text-align: right;">— Page ${citation.page}</div>` : ''}
            `;
            citationsDiv.appendChild(citationBlock);
          });
          
          contentDiv.appendChild(citationsDiv);
        }
        break;
      case 'images-oeuvre':
        contentDiv.appendChild(createPDFSection('Images dans l\'œuvre', sheet.images || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Fonction des images', sheet.fonction || 'Non renseigné'));
        break;
      case 'contexte-perspectives':
        contentDiv.appendChild(createPDFSection('Biographie de l\'auteur', sheet.biographie || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Place dans l\'œuvre', sheet.place || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Courants littéraires', sheet.courants || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Contexte historique', sheet.contexte || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Réception critique', sheet.reception || 'Non renseigné'));
        break;
      case 'comparatisme':
        contentDiv.appendChild(createPDFSection('Autres œuvres de l\'auteur', sheet.oeuvres || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Thématiques communes', sheet.thematiques || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Points de convergence', sheet.convergence || 'Non renseigné'));
        break;
      case 'annexes':
        contentDiv.appendChild(createPDFSection('Glossaire', sheet.glossaire || 'Non renseigné', true));
        contentDiv.appendChild(createPDFSection('Notes personnelles', sheet.notes || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Schémas et cartes', sheet.schemas || 'Non renseigné'));
        contentDiv.appendChild(createPDFSection('Références', sheet.references || 'Non renseigné'));
        break;
      default:
        contentDiv.appendChild(createPDFSection('Contenu personnalisé', 'Contenu de l\'onglet personnalisé', true));
    }
    
    return contentDiv;
  };

  // Helper function to get tab content for export with enhanced styling
  const getTabContentForExport = (tabId: string): HTMLElement | null => {
    // Create a simplified version of the tab content for export
    const contentDiv = document.createElement('div');
    
    const createStyledSection = (title: string, content: string, isMain = false) => {
      const section = document.createElement('div');
      section.style.marginBottom = '30px';
      section.style.padding = '20px';
      section.style.backgroundColor = isMain ? `${theme.primary}10` : '#f8f9fa';
      section.style.borderRadius = '12px';
      section.style.border = `1px solid ${theme.border}`;
      section.style.position = 'relative';
      
      // Add a decorative left border for main sections
      if (isMain) {
        section.style.borderLeft = `4px solid ${theme.primary}`;
      }
      
      const titleElement = document.createElement('h3');
      titleElement.style.color = theme.primary;
      titleElement.style.marginBottom = '15px';
      titleElement.style.fontSize = '18px';
      titleElement.style.fontWeight = 'bold';
      titleElement.style.fontFamily = theme.titleFont || 'serif';
      titleElement.textContent = title;
      
      const contentElement = document.createElement('div');
      contentElement.style.color = theme.text;
      contentElement.style.fontSize = '16px';
      contentElement.style.lineHeight = '1.6';
      contentElement.style.minHeight = '120px';
      contentElement.style.whiteSpace = 'pre-wrap';
      contentElement.style.fontFamily = theme.textFont || 'serif';
      contentElement.textContent = content || 'Non renseigné';
      
      section.appendChild(titleElement);
      section.appendChild(contentElement);
      return section;
    };
    
    switch (tabId) {
      case 'resume-architecture':
        contentDiv.appendChild(createStyledSection('Titre de l\'œuvre', sheet.titre || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Auteur', sheet.auteur || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Résumé détaillé', sheet.resume || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Plan narratif / Architecture', sheet.plan || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Temporalités', sheet.temporalites || 'Non renseigné'));
        break;
      case 'analyse-stylistique':
        contentDiv.appendChild(createStyledSection('Points de vue / Focalisation', sheet.pointsVue || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Système des personnages', sheet.personnages || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Registres, tonalités, leitmotive', sheet.registres || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Rythme narratif', sheet.rythme || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Figures de style', sheet.figures || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Procédés stylistiques', sheet.procedes || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Lexique', sheet.lexique || 'Non renseigné'));
        break;
      case 'problematiques-enjeux':
        contentDiv.appendChild(createStyledSection('Axes d\'analyse', sheet.axes || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Tensions et conflits', sheet.tensions || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Lectures critiques', sheet.lectures || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Intuitions personnelles', sheet.intuitions || 'Non renseigné'));
        
        // Add citations section with special styling
        if (sheet.citations && sheet.citations.some(c => c.text)) {
          const citationsDiv = document.createElement('div');
          citationsDiv.style.marginBottom = '30px';
          citationsDiv.style.padding = '20px';
          citationsDiv.style.backgroundColor = `${theme.secondary}10`;
          citationsDiv.style.borderRadius = '12px';
          citationsDiv.style.border = `1px solid ${theme.secondary}30`;
          citationsDiv.style.borderLeft = `4px solid ${theme.secondary}`;
          
          const citationsTitle = document.createElement('h3');
          citationsTitle.style.color = theme.secondary;
          citationsTitle.style.marginBottom = '15px';
          citationsTitle.style.fontSize = '18px';
          citationsTitle.style.fontWeight = 'bold';
          citationsTitle.textContent = 'Citations clés';
          citationsDiv.appendChild(citationsTitle);
          
          sheet.citations.filter(c => c.text).forEach(citation => {
            const citationBlock = document.createElement('div');
            citationBlock.style.marginBottom = '15px';
            citationBlock.style.padding = '15px';
            citationBlock.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            citationBlock.style.borderRadius = '8px';
            citationBlock.style.borderLeft = `3px solid ${theme.secondary}`;
            citationBlock.style.fontStyle = 'italic';
            citationBlock.innerHTML = `
              <div style="color: ${theme.text}; margin-bottom: 8px;">"${citation.text}"</div>
              ${citation.page ? `<div style="color: ${theme.textLight}; font-size: 14px; text-align: right;">— Page ${citation.page}</div>` : ''}
            `;
            citationsDiv.appendChild(citationBlock);
          });
          
          contentDiv.appendChild(citationsDiv);
        }
        break;
      case 'images-oeuvre':
        contentDiv.appendChild(createStyledSection('Images dans l\'œuvre', sheet.images || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Fonction des images', sheet.fonction || 'Non renseigné'));
        break;
      case 'contexte-perspectives':
        contentDiv.appendChild(createStyledSection('Biographie de l\'auteur', sheet.biographie || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Place dans l\'œuvre', sheet.place || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Courants littéraires', sheet.courants || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Contexte historique', sheet.contexte || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Réception critique', sheet.reception || 'Non renseigné'));
        break;
      case 'comparatisme':
        contentDiv.appendChild(createStyledSection('Autres œuvres de l\'auteur', sheet.oeuvres || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Thématiques communes', sheet.thematiques || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Points de convergence', sheet.convergence || 'Non renseigné'));
        break;
      case 'annexes':
        contentDiv.appendChild(createStyledSection('Glossaire', sheet.glossaire || 'Non renseigné', true));
        contentDiv.appendChild(createStyledSection('Notes personnelles', sheet.notes || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Schémas et cartes', sheet.schemas || 'Non renseigné'));
        contentDiv.appendChild(createStyledSection('Références', sheet.references || 'Non renseigné'));
        break;
      default:
        contentDiv.appendChild(createStyledSection('Contenu personnalisé', 'Contenu de l\'onglet personnalisé', true));
    }
    
    return contentDiv;
  };

  const exportToJPG = () => exportToImages('jpeg');
  const exportToPNG = () => exportToImages('png');

  // Generate background patterns based on theme
  const getBackgroundPattern = (themeName: string) => {
    if (themeName === 'bulletJournal') {
      // SVG pattern with colorful circles for Bullet Journal
      return `
        url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='bulletPattern' patternUnits='userSpaceOnUse' width='40' height='40'><rect width='40' height='40' fill='transparent'/><circle cx='10' cy='10' r='2' fill='${encodeURIComponent(theme.primary)}' opacity='0.1'/><circle cx='30' cy='20' r='1.5' fill='${encodeURIComponent(theme.secondary)}' opacity='0.15'/><circle cx='20' cy='35' r='1' fill='${encodeURIComponent(theme.accent)}' opacity='0.2'/></pattern></defs><rect width='100' height='100' fill='url(%23bulletPattern)'/></svg>")
      `;
    } else if (themeName === 'livreVintage') {
      // SVG pattern with geometric shapes for Vintage
      return `
        url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='vintagePattern' patternUnits='userSpaceOnUse' width='60' height='60'><rect width='60' height='60' fill='transparent'/><rect x='10' y='10' width='8' height='8' fill='${encodeURIComponent(theme.primary)}' opacity='0.08' transform='rotate(45 14 14)'/><circle cx='45' cy='30' r='3' fill='${encodeURIComponent(theme.secondary)}' opacity='0.12'/><line x1='5' y1='50' x2='25' y2='50' stroke='${encodeURIComponent(theme.accent)}' stroke-width='1' opacity='0.1'/></pattern></defs><rect width='100' height='100' fill='url(%23vintagePattern)'/></svg>")
      `;
    } else {
      // Default grid pattern for other themes
      return `
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
      `;
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ 
        backgroundColor: theme.background,
        backgroundImage: theme.backgroundImage ? 
          `url(${theme.backgroundImage}), ${getBackgroundPattern(currentTheme)}` : 
          getBackgroundPattern(currentTheme),
        backgroundSize: theme.backgroundImage ? 
          'cover, 20px 20px' : 
          (currentTheme === 'bulletJournal' || currentTheme === 'livreVintage' ? '40px 40px' : '20px 20px'),
        backgroundPosition: theme.backgroundImage ? 'center, 0 0' : '0 0',
        backgroundBlendMode: theme.backgroundImage ? 'overlay' : 'normal',
        color: theme.text,
        fontFamily: theme.textFont || 'serif'
      }}
    >
      {/* Background image overlay */}
      {theme.backgroundImage && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${theme.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: theme.backgroundImageOpacity || 0.1,
            // Add a slight transition for smooth opacity changes
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
      {/* Theme-specific decorations */}
      {currentTheme === 'bulletJournal' && <BulletDecorations theme={theme} />}
      {currentTheme === 'livreVintage' && <VintageDecorations theme={theme} />}

      {/* Theme Controls */}
      {isThemeSelectorOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setIsThemeSelectorOpen(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: theme.text }}>
                🎨 Gestion des thèmes
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomThemeCreator(!showCustomThemeCreator)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-80 ${
                    showCustomThemeCreator ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                >
                  {showCustomThemeCreator ? 'Masquer créateur' : 'Créer un thème'}
                </button>
                <button
                  onClick={() => setIsThemeSelectorOpen(false)}
                  className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-80"
                  style={{ backgroundColor: theme.primary }}
                >
                  Fermer
                </button>
              </div>
            </div>

            {showCustomThemeCreator ? (
              <CustomThemeCreator
                currentTheme={theme}
                onThemeChange={handleThemeChange}
                onClose={() => setShowCustomThemeCreator(false)}
              />
            ) : (
              <>
                {/* Predefined Themes */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                    Thèmes prédéfinis
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.keys(themes).map((themeKey) => (
                      <div key={themeKey} className="text-center">
                        <ThemeButton 
                          themeKey={themeKey as keyof typeof themes} 
                          isActive={currentTheme === themeKey && !customThemeData} 
                        />
                        <div className="text-xs mt-2" style={{ color: theme.textLight }}>
                          {themes[themeKey as keyof typeof themes].name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Themes */}
                {customThemes.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                      Thèmes personnalisés
                    </h4>
                    <div className="grid grid-cols-5 gap-4">
                      {customThemes.map((customTheme) => (
                        <div key={customTheme.id} className="text-center">
                          <CustomThemeButton 
                            theme={customTheme} 
                            isActive={currentTheme === 'custom' && customThemeData?.id === customTheme.id} 
                          />
                          <div className="text-xs mt-2" style={{ color: theme.textLight }}>
                            {customTheme.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customThemes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun thème personnalisé créé</p>
                    <p className="text-sm">Cliquez sur "Créer un thème" pour commencer</p>
                  </div>
                )}
              </>
            )}
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
          <h1 className="text-4xl font-bold mb-2 relative z-10" style={{ fontFamily: theme.titleFont || 'serif' }}>
              📖 Fiche de Lecture
            </h1>
            <h2 className="text-2xl font-normal relative z-10" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: theme.titleFont || 'serif' }}>
              {sheet.titre || 'Titre de l\'œuvre à saisir'}
            </h2>
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
                    Export Images (par onglet)
                  </div>
                  <button
                    onClick={exportToJPG}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🖼️ Exporter en JPG
                  </button>
                  <button
                    onClick={exportToPNG}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🖼️ Exporter en PNG
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

          {/* Tab Manager */}
          <TabManager
            sheet={sheet}
            updateField={updateField}
            updateCitation={updateCitation}
            addCitation={addCitation}
            removeCitation={removeCitation}
            theme={theme}
            onTabsChange={(newTabs) => {
              // Handle tab changes if needed
            }}
          />

          {/* Footer */}
          <div className="text-center py-8 mt-8" style={{ color: theme.textLight }}>
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
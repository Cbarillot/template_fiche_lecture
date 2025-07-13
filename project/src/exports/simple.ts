import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import { ReadingSheet, ExportOptions, ExportResult } from './types';

// Generate PDF using jsPDF (similar to Python's fpdf)
export const generatePDF = (data: ReadingSheet, options: ExportOptions = {}): ExportResult => {
  try {
    const pdf = new jsPDF();
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 15;
    const maxLineWidth = pageWidth - 2 * margin;

    // Helper function to add text with automatic line breaks
    const addText = (text: string, x: number, y: number, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, maxLineWidth);
      
      lines.forEach((line: string, index: number) => {
        if (y + (index * 6) > pageHeight - 20) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, x, y + (index * 6));
      });
      
      return y + (lines.length * 6);
    };

    // Header
    yPosition = addText('Fiche de Lecture', margin, yPosition, 16, true);
    yPosition += 10;

    // Content sections
    const sections = [
      { key: 'titre', label: 'Titre' },
      { key: 'auteur', label: 'Auteur' },
      { key: 'resume', label: 'Résumé' },
      { key: 'plan', label: 'Plan' },
      { key: 'temporalites', label: 'Temporalités' },
      { key: 'pointsVue', label: 'Points de vue' },
      { key: 'personnages', label: 'Personnages' },
      { key: 'registres', label: 'Registres' },
      { key: 'rythme', label: 'Rythme' },
      { key: 'figures', label: 'Figures' },
      { key: 'procedes', label: 'Procédés' },
      { key: 'lexique', label: 'Lexique' },
      { key: 'axes', label: 'Axes' },
      { key: 'tensions', label: 'Tensions' },
      { key: 'lectures', label: 'Lectures' },
      { key: 'intuitions', label: 'Intuitions' },
      { key: 'images', label: 'Images' },
      { key: 'fonction', label: 'Fonction' },
      { key: 'references', label: 'Références' },
      { key: 'biographie', label: 'Biographie' },
      { key: 'place', label: 'Place' },
      { key: 'courants', label: 'Courants' },
      { key: 'contexte', label: 'Contexte' },
      { key: 'reception', label: 'Réception' },
      { key: 'oeuvres', label: 'Œuvres' },
      { key: 'thematiques', label: 'Thématiques' },
      { key: 'convergence', label: 'Convergence' },
      { key: 'glossaire', label: 'Glossaire' },
      { key: 'notes', label: 'Notes' },
      { key: 'schemas', label: 'Schémas' }
    ];

    sections.forEach(section => {
      const value = data[section.key as keyof ReadingSheet];
      
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      // Section title
      yPosition = addText(`${section.label}:`, margin, yPosition, 12, true);
      yPosition += 5;

      // Section content
      if (section.key === 'citations') {
        const citations = value as Array<{ text: string; page: string }>;
        if (citations && citations.some(cit => cit.text)) {
          citations.forEach(citation => {
            if (citation.text) {
              const citationText = `- ${citation.text} (p.${citation.page || '?'})`;
              yPosition = addText(citationText, margin, yPosition);
              yPosition += 3;
            }
          });
        } else {
          yPosition = addText('[Aucune citation renseignée]', margin, yPosition);
        }
      } else if (typeof value === 'string') {
        const content = value.trim() || '[Non renseigné]';
        yPosition = addText(content, margin, yPosition);
      } else {
        yPosition = addText(String(value) || '[Non renseigné]', margin, yPosition);
      }
      
      yPosition += 8;
    });

    // Citations section
    if (data.citations && data.citations.some(cit => cit.text)) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      yPosition = addText('Citations:', margin, yPosition, 12, true);
      yPosition += 5;
      
      data.citations.forEach(citation => {
        if (citation.text) {
          const citationText = `- ${citation.text} (p.${citation.page || '?'})`;
          yPosition = addText(citationText, margin, yPosition);
          yPosition += 3;
        }
      });
    }

    const pdfBlob = pdf.output('blob');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `fiche_lecture_${timestamp}.pdf`;

    return {
      success: true,
      filename,
      data: pdfBlob
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: 'Error generating PDF: ' + (error as Error).message
    };
  }
};

// Generate DOCX using docx library (similar to Python's python-docx)
export const generateDOCX = (data: ReadingSheet, options: ExportOptions = {}): Promise<ExportResult> => {
  return new Promise(async (resolve) => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: 'Fiche de Lecture',
              heading: HeadingLevel.TITLE,
              alignment: 'center'
            }),
            new Paragraph({ text: '' }), // Empty line
            
            // Content sections
            ...generateDocxSections(data)
          ]
        }]
      });

      const buffer = await Packer.toBlob(doc);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `fiche_lecture_${timestamp}.docx`;

      resolve({
        success: true,
        filename,
        data: buffer
      });
    } catch (error) {
      console.error('Error generating DOCX:', error);
      resolve({
        success: false,
        error: 'Error generating DOCX: ' + (error as Error).message
      });
    }
  });
};

// Helper function to generate DOCX sections
const generateDocxSections = (data: ReadingSheet): Paragraph[] => {
  const sections: Paragraph[] = [];
  
  const sectionData = [
    { key: 'titre', label: 'Titre' },
    { key: 'auteur', label: 'Auteur' },
    { key: 'resume', label: 'Résumé' },
    { key: 'plan', label: 'Plan' },
    { key: 'temporalites', label: 'Temporalités' },
    { key: 'pointsVue', label: 'Points de vue' },
    { key: 'personnages', label: 'Personnages' },
    { key: 'registres', label: 'Registres' },
    { key: 'rythme', label: 'Rythme' },
    { key: 'figures', label: 'Figures' },
    { key: 'procedes', label: 'Procédés' },
    { key: 'lexique', label: 'Lexique' },
    { key: 'axes', label: 'Axes' },
    { key: 'tensions', label: 'Tensions' },
    { key: 'lectures', label: 'Lectures' },
    { key: 'intuitions', label: 'Intuitions' },
    { key: 'images', label: 'Images' },
    { key: 'fonction', label: 'Fonction' },
    { key: 'references', label: 'Références' },
    { key: 'biographie', label: 'Biographie' },
    { key: 'place', label: 'Place' },
    { key: 'courants', label: 'Courants' },
    { key: 'contexte', label: 'Contexte' },
    { key: 'reception', label: 'Réception' },
    { key: 'oeuvres', label: 'Œuvres' },
    { key: 'thematiques', label: 'Thématiques' },
    { key: 'convergence', label: 'Convergence' },
    { key: 'glossaire', label: 'Glossaire' },
    { key: 'notes', label: 'Notes' },
    { key: 'schemas', label: 'Schémas' }
  ];

  sectionData.forEach(section => {
    const value = data[section.key as keyof ReadingSheet];
    
    // Section heading
    sections.push(new Paragraph({
      text: section.label,
      heading: HeadingLevel.HEADING_2
    }));

    // Section content
    if (section.key === 'citations') {
      const citations = value as Array<{ text: string; page: string }>;
      if (citations && citations.some(cit => cit.text)) {
        citations.forEach(citation => {
          if (citation.text) {
            sections.push(new Paragraph({
              children: [
                new TextRun({ text: '• ', bold: true }),
                new TextRun({ text: citation.text }),
                new TextRun({ text: ` (p.${citation.page || '?'})`, italics: true })
              ]
            }));
          }
        });
      } else {
        sections.push(new Paragraph({
          text: '[Aucune citation renseignée]',
          italics: true
        }));
      }
    } else if (typeof value === 'string') {
      const content = value.trim() || '[Non renseigné]';
      sections.push(new Paragraph({
        text: content,
        italics: !value.trim()
      }));
    } else {
      sections.push(new Paragraph({
        text: String(value) || '[Non renseigné]',
        italics: !value
      }));
    }
  });

  return sections;
};

// Main export function that provides both PDF and DOCX
export const exportSimple = {
  pdf: generatePDF,
  docx: generateDOCX
};
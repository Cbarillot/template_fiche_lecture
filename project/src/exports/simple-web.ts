import { ReadingSheet, ExportOptions, ExportResult } from './types';

// Generate simple web HTML (similar to Python simple_web version)
export const generateHTML = (data: ReadingSheet, options: ExportOptions = {}): ExportResult => {
  try {
    const titre = data.titre || 'Sans titre';
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Simple CSS styles
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
      
      body {
        font-family: 'Roboto', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
      }
      
      .header {
        background-color: #2c3e50;
        color: white;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 30px;
      }
      
      h1 { 
        margin: 0; 
        font-size: 28px; 
      }
      
      .section {
        background: white;
        border-radius: 5px;
        padding: 20px;
        margin-bottom: 20px;
      }
      
      h2 {
        color: #2c3e50;
        border-bottom: 2px solid #eee;
        padding-bottom: 8px;
        margin-top: 0;
      }
      
      .empty { 
        color: #999; 
        font-style: italic; 
      }
      
      .citation {
        background: #f8f9fa;
        border-left: 4px solid #3498db;
        padding: 10px 15px;
        margin: 10px 0;
      }
      
      .citation-page {
        background: #e74c3c;
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        margin-left: 10px;
      }
      
      .footer {
        text-align: center;
        margin-top: 40px;
        color: #7f8c8d;
        font-size: 12px;
      }
    `;

    // HTML structure
    const htmlParts = [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      "    <meta charset='UTF-8'>",
      `    <title>Fiche de Lecture - ${titre}</title>`,
      `    <style>${css}</style>`,
      "</head>",
      "<body>",
      "    <div class='header'>",
      "        <h1>Fiche de Lecture</h1>",
      `        <p>Générée le ${dateStr}</p>`,
      "    </div>"
    ];

    // Sections ordered as in Python version
    const sectionsOrder = [
      'titre', 'auteur', 'resume', 'plan', 'temporalites',
      'pointsVue', 'personnages', 'registres', 'rythme', 'figures',
      'procedes', 'lexique', 'citations', 'axes', 'tensions',
      'lectures', 'intuitions', 'images', 'fonction', 'references',
      'biographie', 'place', 'courants', 'contexte', 'reception',
      'oeuvres', 'thematiques', 'convergence', 'glossaire', 'notes', 'schemas'
    ];

    // Generate content sections
    sectionsOrder.forEach(section => {
      if (section in data) {
        const value = data[section as keyof ReadingSheet];
        
        htmlParts.push(`    <div class='section'>`);
        htmlParts.push(`        <h2>${section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}</h2>`);
        
        if (section === 'citations') {
          const citations = value as Array<{ text: string; page: string }>;
          if (citations && citations.some(cit => cit.text)) {
            citations.forEach(citation => {
              if (citation.text) {
                const pageSpan = citation.page ? 
                  `<span class='citation-page'>p. ${citation.page}</span>` : '';
                htmlParts.push(`        <div class='citation'>`);
                htmlParts.push(`            ${escapeHtml(citation.text)} ${pageSpan}`);
                htmlParts.push(`        </div>`);
              }
            });
          } else {
            htmlParts.push(`        <p class='empty'>Aucune citation renseignée</p>`);
          }
        } else if (typeof value === 'string') {
          if (value.trim()) {
            const escaped = escapeHtml(value).replace(/\n/g, '<br>');
            htmlParts.push(`        <p>${escaped}</p>`);
          } else {
            htmlParts.push(`        <p class='empty'>Non renseigné</p>`);
          }
        } else if (value !== null && value !== undefined) {
          htmlParts.push(`        <p>${escapeHtml(String(value))}</p>`);
        }
        
        htmlParts.push(`    </div>`);
      }
    });

    // Footer
    htmlParts.push(`    <div class='footer'>`);
    htmlParts.push(`        <p>Fiche générée automatiquement - © 2025</p>`);
    htmlParts.push(`    </div>`);
    htmlParts.push("</body>");
    htmlParts.push("</html>");

    const html = htmlParts.join('\n');
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `fiche_lecture_simple_web_${timestamp}.html`;

    return {
      success: true,
      filename,
      data: htmlBlob
    };
  } catch (error) {
    console.error('Error generating simple web HTML:', error);
    return {
      success: false,
      error: 'Error generating simple web HTML: ' + (error as Error).message
    };
  }
};

// Helper function to escape HTML characters
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Export function
export const exportSimpleWeb = {
  html: generateHTML
};
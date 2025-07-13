import { ReadingSheet, ExportOptions, ExportResult } from './types';

// Font Awesome icons mapping (similar to Python version)
const getIcon = (sectionName: string): string => {
  const icons: { [key: string]: string } = {
    'titre': 'book',
    'auteur': 'user-edit',
    'resume': 'file-alt',
    'plan': 'list-ol',
    'temporalites': 'clock',
    'pointsVue': 'users',
    'personnages': 'user-friends',
    'registres': 'theater-masks',
    'rythme': 'tachometer-alt',
    'figures': 'shapes',
    'procedes': 'magic',
    'lexique': 'book-reader',
    'citations': 'quote-right',
    'axes': 'project-diagram',
    'tensions': 'bolt',
    'lectures': 'book-open',
    'intuitions': 'lightbulb',
    'images': 'image',
    'fonction': 'cogs',
    'references': 'link',
    'biographie': 'address-card',
    'place': 'map-marker-alt',
    'courants': 'stream',
    'contexte': 'history',
    'reception': 'comments',
    'oeuvres': 'book-medical',
    'thematiques': 'tags',
    'convergence': 'random',
    'glossaire': 'spell-check',
    'notes': 'sticky-note',
    'schemas': 'project-diagram'
  };
  return icons[sectionName] || 'file-alt';
};

// Generate modern HTML with advanced styling
export const generateHTML = (data: ReadingSheet, options: ExportOptions = {}): ExportResult => {
  try {
    const titre = data.titre || 'Sans titre';
    const auteur = data.auteur || 'Auteur inconnu';
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // CSS styles (converted from Python version)
    const css = `
      :root {
        --primary: #4a6fa5;
        --secondary: #6c757d;
        --light: #f8f9fa;
        --dark: #343a40;
        --success: #28a745;
        --info: #17a2b8;
        --warning: #ffc107;
        --danger: #dc3545;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Poppins', sans-serif;
        line-height: 1.7;
        color: #333;
        background-color: #f5f7fb;
        margin: 0;
        padding: 0;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      .header {
        background: linear-gradient(135deg, var(--primary), #6a11cb);
        color: white;
        padding: 2rem 0;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
      }
      
      .header-text h1 {
        font-size: 2.2rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }
      
      .header-text p {
        font-size: 1.1rem;
        opacity: 0.9;
      }
      
      .meta {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.8rem 1.2rem;
        border-radius: 30px;
        font-size: 0.9rem;
      }
      
      .section {
        background: white;
        border-radius: 10px;
        padding: 1.8rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        border-left: 4px solid var(--primary);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .section:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      }
      
      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 1.2rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px dashed #e1e4e8;
      }
      
      .section-icon {
        width: 40px;
        height: 40px;
        background: var(--primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: white;
        font-size: 1rem;
        flex-shrink: 0;
      }
      
      .section-title {
        font-size: 1.3rem;
        color: var(--dark);
        margin: 0;
        font-weight: 600;
      }
      
      .citation {
        background: #f8f9ff;
        border-left: 4px solid var(--info);
        padding: 1.2rem;
        margin: 1rem 0;
        border-radius: 0 8px 8px 0;
        position: relative;
      }
      
      .citation:before {
        content: '\\201C';
        font-family: Georgia, serif;
        font-size: 4rem;
        color: #e1e4e8;
        position: absolute;
        left: 10px;
        top: -10px;
        line-height: 1;
      }
      
      .citation-text {
        font-style: italic;
        margin-bottom: 0.5rem;
        position: relative;
        z-index: 1;
      }
      
      .citation-page {
        display: inline-block;
        background: var(--info);
        color: white;
        padding: 0.2rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        margin-top: 0.5rem;
      }
      
      .empty-field {
        color: #6c757d;
        font-style: italic;
        opacity: 0.7;
      }
      
      .footer {
        text-align: center;
        padding: 2rem 0;
        margin-top: 3rem;
        color: #6c757d;
        font-size: 0.9rem;
        border-top: 1px solid #e1e4e8;
      }
      
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          text-align: center;
        }
        
        .meta {
          margin-top: 1rem;
        }
        
        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .section-icon {
          margin-bottom: 0.8rem;
        }
      }
      
      @media print {
        body {
          background: white;
          font-size: 12pt;
          line-height: 1.5;
        }
        
        .header {
          background: #4a6fa5 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .section {
          break-inside: avoid;
          page-break-inside: avoid;
          border: 1px solid #e1e4e8;
        }
        
        .footer {
          display: none;
        }
      }
    `;

    // HTML structure
    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche de Lecture - ${titre}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="header-text">
                    <h1>${titre}</h1>
                    <p>Une analyse complète de l'œuvre</p>
                </div>
                <div class="meta">
                    <i class="fas fa-user-edit"></i> ${auteur} • 
                    <i class="far fa-calendar-alt"></i> ${dateStr}
                </div>
            </div>
        </div>
    </header>

    <main class="container">`;

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
        const icon = getIcon(section);
        
        // Skip title and author as they're already in the header
        if (section === 'titre' || section === 'auteur') {
          return;
        }
        
        html += `
        <section class="section">
            <div class="section-header">
                <div class="section-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <h2 class="section-title">${section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}</h2>
            </div>
            <div class="section-content">`;
        
        if (section === 'citations') {
          const citations = value as Array<{ text: string; page: string }>;
          if (citations && citations.some(cit => cit.text)) {
            citations.forEach(citation => {
              if (citation.text) {
                html += `
                <div class="citation">
                    <p class="citation-text">${escapeHtml(citation.text)}</p>
                    ${citation.page ? `<span class="citation-page">Page ${citation.page}</span>` : ''}
                </div>`;
              }
            });
          } else {
            html += `<p class="empty-field">Aucune citation renseignée</p>`;
          }
        } else if (typeof value === 'string') {
          if (value.trim()) {
            const escaped = escapeHtml(value).replace(/\n/g, '<br>');
            html += `<p>${escaped}</p>`;
          } else {
            html += `<p class="empty-field">Non renseigné</p>`;
          }
        } else if (value !== null && value !== undefined) {
          html += `<p>${escapeHtml(String(value))}</p>`;
        }
        
        html += `
            </div>
        </section>`;
      }
    });

    // Footer
    html += `
    </main>

    <footer class="footer">
        <div class="container">
            <p>Fiche générée automatiquement le ${dateStr} • © 2025</p>
        </div>
    </footer>
</body>
</html>`;

    const htmlBlob = new Blob([html], { type: 'text/html' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `fiche_lecture_modern_${timestamp}.html`;

    return {
      success: true,
      filename,
      data: htmlBlob
    };
  } catch (error) {
    console.error('Error generating modern HTML:', error);
    return {
      success: false,
      error: 'Error generating modern HTML: ' + (error as Error).message
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
export const exportModern = {
  html: generateHTML
};
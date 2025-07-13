import json
import os
import sys
from datetime import datetime
import webbrowser

def get_icon(section_name):
    """Retourne une icône Font Awesome pour chaque section."""
    icons = {
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
    }
    return icons.get(section_name, 'file-alt')

def generate_html(data):
    """Génère le contenu HTML avec un style moderne."""
    titre = data.get('titre', 'Sans titre')
    auteur = data.get('auteur', 'Auteur inconnu')
    date_str = datetime.now().strftime('%d %B %Y')
    
    # En-tête HTML avec CSS intégré
    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche de Lecture - {titre}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {{
            --primary: #4a6fa5;
            --secondary: #6c757d;
            --light: #f8f9fa;
            --dark: #343a40;
            --success: #28a745;
            --info: #17a2b8;
            --warning: #ffc107;
            --danger: #dc3545;
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Poppins', sans-serif;
            line-height: 1.7;
            color: #333;
            background-color: #f5f7fb;
            margin: 0;
            padding: 0;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }}
        
        /* En-tête */
        .header {{
            background: linear-gradient(135deg, var(--primary), #6a11cb);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        
        .header-content {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }}
        
        .header-text h1 {{
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }}
        
        .header-text p {{
            font-size: 1.1rem;
            opacity: 0.9;
        }}
        
        .meta {{
            background: rgba(255, 255, 255, 0.1);
            padding: 0.8rem 1.2rem;
            border-radius: 30px;
            font-size: 0.9rem;
        }}
        
        /* Cartes de section */
        .section {{
            background: white;
            border-radius: 10px;
            padding: 1.8rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
            border-left: 4px solid var(--primary);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }}
        
        .section:hover {{
            transform: translateY(-3px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }}
        
        .section-header {{
            display: flex;
            align-items: center;
            margin-bottom: 1.2rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px dashed #e1e4e8;
        }}
        
        .section-icon {{
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
        }}
        
        .section-title {{
            font-size: 1.3rem;
            color: var(--dark);
            margin: 0;
            font-weight: 600;
        }}
        
        /* Citations */
        .citation {{
            background: #f8f9ff;
            border-left: 4px solid var(--info);
            padding: 1.2rem;
            margin: 1rem 0;
            border-radius: 0 8px 8px 0;
            position: relative;
        }}
        
        .citation:before {{
            content: '\201C';
            font-family: Georgia, serif;
            font-size: 4rem;
            color: #e1e4e8;
            position: absolute;
            left: 10px;
            top: -10px;
            line-height: 1;
        }}
        
        .citation-text {{
            font-style: italic;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 1;
        }}
        
        .citation-page {{
            display: inline-block;
            background: var(--info);
            color: white;
            padding: 0.2rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-top: 0.5rem;
        }}
        
        /* Champs vides */
        .empty-field {{
            color: #6c757d;
            font-style: italic;
            opacity: 0.7;
        }}
        
        /* Pied de page */
        .footer {{
            text-align: center;
            padding: 2rem 0;
            margin-top: 3rem;
            color: #6c757d;
            font-size: 0.9rem;
            border-top: 1px solid #e1e4e8;
        }}
        
        /* Réactivité */
        @media (max-width: 768px) {{
            .header-content {{
                flex-direction: column;
                text-align: center;
            }}
            
            .meta {{
                margin-top: 1rem;
            }}
            
            .section-header {{
                flex-direction: column;
                align-items: flex-start;
            }}
            
            .section-icon {{
                margin-bottom: 0.8rem;
            }}
        }}
        
        /* Styles d'impression */
        @media print {{
            body {{
                background: white;
                font-size: 12pt;
                line-height: 1.5;
            }}
            
            .header {{
                background: #4a6fa5 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }}
            
            .section {{
                break-inside: avoid;
                page-break-inside: avoid;
                border: 1px solid #e1e4e8;
            }}
            
            .footer {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="header-text">
                    <h1>📖 Fiche de Lecture</h1>
                    <p>{titre}</p>
                </div>
                <div class="meta">
                    <i class="fas fa-user-edit"></i> {auteur} • 
                    <i class="far fa-calendar-alt"></i> {date_str}
                </div>
            </div>
        </div>
    </header>

    <main class="container">"""

    # Sections ordonnées
    sections_order = [
        'titre', 'auteur', 'resume', 'plan', 'temporalites',
        'pointsVue', 'personnages', 'registres', 'rythme', 'figures',
        'procedes', 'lexique', 'citations', 'axes', 'tensions',
        'lectures', 'intuitions', 'images', 'fonction', 'references',
        'biographie', 'place', 'courants', 'contexte', 'reception',
        'oeuvres', 'thematiques', 'convergence', 'glossaire', 'notes', 'schemas'
    ]
    
    # Génération du contenu des sections
    for section in sections_order:
        if section in data:
            value = data[section]
            icon = get_icon(section)
            
            # Sauter l'affichage des sections titre et auteur déjà dans l'en-tête
            if section in ['titre', 'auteur']:
                continue
                
            html += f"""
            <section class="section">
                <div class="section-header">
                    <div class="section-icon">
                        <i class="fas fa-{icon}"></i>
                    </div>
                    <h2 class="section-title">{section.capitalize().replace('_', ' ')}</h2>
                </div>
                <div class="section-content">"""
            
            if section == 'citations':
                if value and any(cit.get('text') for cit in value):
                    for citation in value:
                        if citation.get('text'):
                            html += f"""
                    <div class="citation">
                        <p class="citation-text">{citation['text']}</p>
                        {f'<span class="citation-page">Page {citation["page"]}</span>' if citation.get('page') else ''}
                    </div>"""
                else:
                    html += """
                    <p class="empty-field">Aucune citation renseignée</p>"""
            
            elif isinstance(value, str):
                if value.strip():
                    # Échapper les caractères HTML et remplacer les retours à la ligne par des <br>
                    escaped = value.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    html += f"""
                    <p>{escaped.replace(chr(10), '<br>')}</p>"""
                else:
                    html += """
                    <p class="empty-field">Non renseigné</p>"""
            
            elif value is not None:
                html += f"""
                    <p>{str(value)}</p>"""
            
            html += """
                </div>
            </section>"""
    
    # Pied de page
    html += """
    </main>

    <footer class="footer">
        <div class="container">
            <p>Fiche générée automatiquement le {date_str} • © 2025</p>
        </div>
    </footer>
</body>
</html>""".format(
        titre=titre,
        auteur=auteur,
        date_str=date_str
    )
    
    return html

def save_file(content, filepath):
    """Enregistre le contenu dans un fichier."""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    # Vérifier les arguments
    if len(sys.argv) < 2:
        print("Utilisation : python export_fiche_modern.py chemin/vers/votre/fiche.json")
        return
    
    json_file = sys.argv[1]
    
    # Vérifier si le fichier existe
    if not os.path.exists(json_file):
        print(f"Erreur : Le fichier {json_file} n'existe pas.")
        return
    
    # Charger les données JSON
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier JSON : {e}")
        return
    
    # Créer le dossier d'export s'il n'existe pas
    export_dir = os.path.join(os.path.dirname(os.path.abspath(json_file)), 'exports')
    os.makedirs(export_dir, exist_ok=True)
    
    # Générer un nom de base pour les fichiers de sortie
    base_name = f"fiche_lecture_modern_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Générer et sauvegarder le HTML
    html_content = generate_html(data)
    html_path = os.path.join(export_dir, f"{base_name}.html")
    save_file(html_content, html_path)
    
    # Ouvrir le fichier HTML généré dans le navigateur
    webbrowser.open('file://' + os.path.abspath(html_path))
    
    print(f"✓ Fichier HTML moderne créé : {html_path}")
    print("\nExportation terminée ! Le fichier a été enregistré dans le dossier 'exports'.")
    print("Pour l'imprimer en PDF :")
    print("1. Ouvrez le fichier dans votre navigateur")
    print("2. Appuyez sur Ctrl+P")
    print("3. Choisissez 'Enregistrer au format PDF' comme imprimante")
    print("4. Cochez 'Fond de page' dans les options d'impression pour inclure les couleurs")
    print("5. Cliquez sur 'Enregistrer'")

if __name__ == "__main__":
    main()

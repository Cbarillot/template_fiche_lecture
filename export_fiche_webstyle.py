import json
import os
import sys
from datetime import datetime
import webbrowser

# Vérifier si wkhtmltopdf est disponible
try:
    import pdfkit
    WKHTMLTOPDF_AVAILABLE = True
except ImportError:
    WKHTMLTOPDF_AVAILABLE = False

def generate_html(data):
    """Génère le contenu HTML avec le style du site web."""
    # Récupérer le titre ou utiliser une valeur par défaut
    titre = data.get('titre', 'Sans titre')
    date_str = datetime.now().strftime('%d/%m/%Y à %H:%M')
    
    # Style CSS pour reproduire la mise en page du site
    css_style = """
    <style>
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
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 500;
        }
        
        .section {
            background: white;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        h2 {
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 8px;
            margin-top: 0;
            font-size: 20px;
        }
        
        .citation {
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 10px 15px;
            margin: 10px 0;
            font-style: italic;
        }
        
        .citation .page {
            display: inline-block;
            background: #e74c3c;
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            margin-left: 10px;
            font-style: normal;
        }
        
        .empty-field {
            color: #999;
            font-style: italic;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #7f8c8d;
            font-size: 12px;
        }
    </style>
    """
    
    # Construction du HTML
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Fiche de Lecture - {titre}</title>
        {css_style}
    </head>
    <body>
        <div class="header">
            <h1>Fiche de Lecture</h1>
            <p>Générée le {date_str}</p>
        </div>
    """.format(css_style=css_style, titre=titre, date_str=date_str)
    
    # Ajout des sections
    sections_order = [
        'titre', 'auteur', 'resume', 'plan', 'temporalites',
        'pointsVue', 'personnages', 'registres', 'rythme', 'figures',
        'procedes', 'lexique', 'citations', 'axes', 'tensions',
        'lectures', 'intuitions', 'images', 'fonction', 'references',
        'biographie', 'place', 'courants', 'contexte', 'reception',
        'oeuvres', 'thematiques', 'convergence', 'glossaire', 'notes', 'schemas'
    ]
    
    for section in sections_order:
        if section in data:
            value = data[section]
            html_content += f'<div class="section">\n'
            # Titre de la section
            html_content += f'<h2>{section.capitalize().replace("_", " ")}</h2>\n'
            # Contenu de la section
            if section == 'citations':
                if value and any(cit.get('text') for cit in value):
                    for citation in value:
                        if citation.get('text'):
                            html_content += f'<div class="citation">'
                            html_content += f'{citation["text"]}'
                            if citation.get('page'):
                                html_content += f'<span class="page">p. {citation["page"]}</span>'
                            html_content += '</div>\n'
                        elif not any(cit.get('text') for cit in value):
                            html_content += '<p class="empty-field">Aucune citation renseignée</p>\n'
            elif isinstance(value, str):
                if value.strip():
                    # Remplace les retours à la ligne par des balises <br> pour le HTML
                    html_content += f'<p>{value.replace("\n", "<br>")}</p>\n'
                else:
                    html_content += '<p class="empty-field">Non renseigné</p>\n'
            elif value is not None:
                html_content += f'<p>{str(value)}</p>\n'
            html_content += '</div>\n'
    # Pied de page
    html_content += """
        <div class="footer">
            <p>Fiche générée automatiquement - © 2025</p>
        </div>
    </body>
    </html>
    """
    
    return html_content

def save_html(html_content, output_path):
    """Enregistre le contenu HTML dans un fichier."""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

def convert_to_pdf(html_path, pdf_path):
    """Convertit le fichier HTML en PDF en utilisant wkhtmltopdf."""
    try:
        # Configuration de pdfkit
        config = pdfkit.configuration(wkhtmltopdf='C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe')
        
        # Options pour le PDF
        options = {
            'page-size': 'A4',
            'margin-top': '15mm',
            'margin-right': '15mm',
            'margin-bottom': '15mm',
            'margin-left': '15mm',
            'encoding': 'UTF-8',
            'no-outline': None
        }
        
        # Conversion en PDF
        pdfkit.from_file(html_path, pdf_path, configuration=config, options=options)
        return True
    except Exception as e:
        print(f"Erreur lors de la conversion en PDF : {e}")
        return False

def main():
    # Vérifier les arguments
    if len(sys.argv) < 2:
        print("Utilisation : python export_fiche_webstyle.py chemin/vers/votre/fiche.json")
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
    base_name = f"fiche_lecture_web_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Générer le HTML
    html_content = generate_html(data)
    html_path = os.path.join(export_dir, f"{base_name}.html")
    save_html(html_content, html_path)
    
    # Si wkhtmltopdf est disponible, générer le PDF
    pdf_path = os.path.join(export_dir, f"{base_name}.pdf")
    
    if WKHTMLTOPDF_AVAILABLE:
        if convert_to_pdf(html_path, pdf_path):
            print(f"✓ Fichier PDF créé : {pdf_path}")
        else:
            print("⚠ Impossible de générer le PDF. Vérifiez que wkhtmltopdf est installé et dans le PATH.")
    else:
        print("⚠ Le module pdfkit n'est pas installé. Installation recommandée pour l'export PDF.")
    
    # Ouvrir le fichier HTML généré dans le navigateur par défaut
    webbrowser.open('file://' + os.path.abspath(html_path))
    
    print(f"✓ Fichier HTML créé : {html_path}")
    print("\nExportation terminée ! Les fichiers ont été enregistrés dans le dossier 'exports'.")

if __name__ == "__main__":
    main()

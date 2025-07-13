import json
import os
import sys
from datetime import datetime
import webbrowser

def generate_html(data):
    """Génère le contenu HTML avec le style du site web."""
    # Récupérer le titre ou utiliser une valeur par défaut
    titre = data.get('titre', 'Sans titre')
    date_str = datetime.now().strftime('%d/%m/%Y à %H:%M')
    
    # Style CSS
    css_style = """<style>
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
        h1 { margin: 0; font-size: 28px; }
        .header h2 {
            margin: 10px 0 0 0;
            font-size: 20px;
            color: rgba(255, 255, 255, 0.9);
            border-bottom: none;
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
        .empty { color: #999; font-style: italic; }
    </style>"""
    
    # Construction du HTML
    html_parts = [
        "<!DOCTYPE html>",
        "<html>",
        "<head>",
        "    <meta charset='UTF-8'>",
        f"    <title>Fiche de Lecture - {titre}</title>",
        f"    {css_style}",
        "</head>",
        "<body>",
        "    <div class='header'>",
        "        <h1>📖 Fiche de Lecture</h1>",
        f"        <h2>{titre}</h2>",
        f"        <p>Générée le {date_str}</p>",
        "    </div>"
    ]
    
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
            html_parts.append(f"    <div class='section'>")
            html_parts.append(f"        <h2>{section.capitalize().replace('_', ' ')}</h2>")
            
            if section == 'citations':
                if value and any(cit.get('text') for cit in value):
                    for citation in value:
                        if citation.get('text'):
                            page = f"<span style='background: #e74c3c; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 10px;'>p. {citation.get('page', '?')}</span>"
                            html_parts.append(f"        <div style='background: #f8f9fa; border-left: 4px solid #3498db; padding: 10px 15px; margin: 10px 0;'>")
                            html_parts.append(f"            {citation['text']} {page if citation.get('page') else ''}")
                            html_parts.append("        </div>")
                        else:
                            html_parts.append("        <p class='empty'>Aucune citation renseignée</p>")
                else:
                    html_parts.append("        <p class='empty'>Aucune citation renseignée</p>")
            
            elif isinstance(value, str):
                if value.strip():
                    # Échapper les caractères HTML et remplacer les retours à la ligne par des <br>
                    escaped = value.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    html_parts.append(f"        <p>{escaped.replace(chr(10), '<br>')}</p>")
                else:
                    html_parts.append("        <p class='empty'>Non renseigné</p>")
            
            elif value is not None:
                html_parts.append(f"        <p>{str(value)}</p>")
            
            html_parts.append("    </div>")
    
    # Pied de page
    html_parts.extend([
        "    <div style='text-align: center; margin-top: 40px; color: #7f8c8d; font-size: 12px;'>",
        "        <p>Fiche générée automatiquement - © 2025</p>",
        "    </div>",
        "</body>",
        "</html>"
    ])
    
    return "\n".join(html_parts)

def save_file(content, filepath):
    """Enregistre le contenu dans un fichier."""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    # Vérifier les arguments
    if len(sys.argv) < 2:
        print("Utilisation : python export_fiche_simple_web.py chemin/vers/votre/fiche.json")
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
    
    # Générer et sauvegarder le HTML
    html_content = generate_html(data)
    html_path = os.path.join(export_dir, f"{base_name}.html")
    save_file(html_content, html_path)
    
    # Ouvrir le fichier HTML généré dans le navigateur
    webbrowser.open('file://' + os.path.abspath(html_path))
    
    print(f"✓ Fichier HTML créé : {html_path}")
    print("\nExportation terminée ! Le fichier a été enregistré dans le dossier 'exports'.")
    print("Pour convertir en PDF, ouvrez ce fichier dans votre navigateur et utilisez la fonction d'impression (Ctrl+P) puis 'Enregistrer au format PDF'.")

if __name__ == "__main__":
    main()

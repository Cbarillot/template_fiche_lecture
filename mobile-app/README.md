# Fiche de Lecture Mobile App

Application mobile React Native pour créer et gérer des fiches de lecture littéraires.

## Fonctionnalités

- ✅ Interface mobile adaptée
- ✅ Thème sombre/clair automatique
- ✅ Sauvegarde locale des données
- ✅ Upload d'images
- ✅ Éditeur de texte riche
- ✅ Navigation par onglets
- 🔄 Zones personnalisables (en cours)
- 🔄 Export PDF (en cours)
- 🔄 Synchronisation cloud (planifié)

## Installation

### Prérequis

- Node.js 16+
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS)

### Étapes d'installation

1. **Cloner et installer les dépendances**
```bash
cd mobile-app
npm install
```

2. **Configuration Android**
```bash
npx react-native run-android
```

3. **Configuration iOS** (macOS uniquement)
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## Structure du projet

```
mobile-app/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── common/         # Composants de base (ThemedText, ThemedView)
│   │   ├── forms/          # Composants de formulaire
│   │   └── sections/       # Sections de contenu
│   ├── screens/            # Écrans de l'application
│   ├── hooks/              # Hooks personnalisés
│   ├── theme/              # Configuration des thèmes
│   ├── types/              # Types TypeScript
│   └── utils/              # Utilitaires
├── android/                # Configuration Android
├── ios/                    # Configuration iOS
└── App.tsx                 # Point d'entrée
```

## Fonctionnalités principales

### 1. Gestion des thèmes
- Thème automatique basé sur les préférences système
- Thèmes clair et sombre
- Couleurs personnalisables

### 2. Sauvegarde des données
- Stockage local avec AsyncStorage
- Sauvegarde automatique
- Récupération des données au démarrage

### 3. Interface adaptée mobile
- Navigation tactile optimisée
- Composants adaptés aux écrans mobiles
- Gestes et interactions natives

### 4. Upload de fichiers
- Sélection d'images depuis la galerie
- Prise de photos avec l'appareil
- Gestion des permissions

## Développement

### Scripts disponibles

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Build de production Android
npm run build:android

# Tests
npm test
```

### Ajout de nouvelles fonctionnalités

1. **Nouvelles sections** : Ajouter dans `src/components/sections/`
2. **Nouveaux écrans** : Ajouter dans `src/screens/`
3. **Nouveaux hooks** : Ajouter dans `src/hooks/`

## Prochaines étapes

1. **Compléter les sections manquantes**
   - Section Résumé & Architecture
   - Section Analyse stylistique
   - Section Problématiques & Enjeux
   - Toutes les autres sections de l'app web

2. **Fonctionnalités avancées**
   - Zones personnalisables avec drag & drop
   - Éditeur de texte riche complet
   - Système de citations
   - Historique des modifications

3. **Export et partage**
   - Export PDF
   - Partage de fiches
   - Import/Export JSON

4. **Synchronisation**
   - Sauvegarde cloud
   - Synchronisation multi-appareils
   - Mode hors ligne

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.
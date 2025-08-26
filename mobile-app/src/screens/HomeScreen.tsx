import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/common/ThemedText';
import { ThemedView } from '../components/common/ThemedView';
import { TitleSection } from '../components/sections/TitleSection';
import { ReadingSheet, Tab } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useStorage } from '../hooks/useStorage';
import { launchImageLibrary } from 'react-native-image-picker';

const DEFAULT_SHEET: ReadingSheet = {
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
  citations: [],
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
  schemas: '',
};

const DEFAULT_TABS: Tab[] = [
  { id: 'titre', title: 'Titre', icon: '📖', isDefault: true, order: 1 },
  { id: 'resume', title: 'Résumé', icon: '📘', isDefault: true, order: 2 },
  { id: 'analyse', title: 'Analyse', icon: '🖋️', isDefault: true, order: 3 },
  { id: 'problematiques', title: 'Problématiques', icon: '🧠', isDefault: true, order: 4 },
];

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { saveData, loadData } = useStorage();
  const [sheet, setSheet] = useState<ReadingSheet>(DEFAULT_SHEET);
  const [activeTab, setActiveTab] = useState('titre');
  const [tabs] = useState<Tab[]>(DEFAULT_TABS);

  useEffect(() => {
    loadSheet();
  }, []);

  const loadSheet = async () => {
    try {
      const savedSheet = await loadData('readingSheet');
      if (savedSheet) {
        setSheet(savedSheet);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const updateField = async (field: keyof ReadingSheet, value: string) => {
    const updatedSheet = { ...sheet, [field]: value };
    setSheet(updatedSheet);
    await saveData('readingSheet', updatedSheet);
  };

  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          Alert.alert('Image sélectionnée', 'Image ajoutée avec succès!');
        }
      }
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'titre':
        return (
          <TitleSection
            sheet={sheet}
            updateField={updateField}
            onImageUpload={handleImageUpload}
          />
        );
      default:
        return (
          <ThemedView backgroundColor="card" style={styles.placeholderContent}>
            <ThemedText variant="title">Section en développement</ThemedText>
            <ThemedText color="textLight">
              Cette section sera bientôt disponible
            </ThemedText>
          </ThemedView>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <ThemedView backgroundColor="primary" style={styles.header}>
        <ThemedText variant="title" style={styles.headerTitle}>
          Fiche de Lecture
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {sheet.titre || 'Nouvelle fiche'}
        </ThemedText>
      </ThemedView>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === tab.id ? theme.primary : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <ThemedText
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? '#ffffff' : theme.text },
              ]}
            >
              {tab.icon} {tab.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  tabsContainer: {
    maxHeight: 60,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  placeholderContent: {
    padding: 40,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../common/ThemedText';
import { ThemedView } from '../common/ThemedView';
import { RichTextInput } from '../forms/RichTextInput';
import { ReadingSheet } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface TitleSectionProps {
  sheet: ReadingSheet;
  updateField: (field: keyof ReadingSheet, value: string) => void;
  onImageUpload?: () => void;
}

export const TitleSection: React.FC<TitleSectionProps> = ({
  sheet,
  updateField,
  onImageUpload,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedView backgroundColor="card" style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="title" style={styles.headerText}>
          📖 Informations générales
        </ThemedText>
        <ThemedText color="textLight" style={styles.subtitle}>
          Renseignez les informations de base de l'œuvre étudiée
        </ThemedText>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <RichTextInput
            label="Titre de l'œuvre"
            value={sheet.titre}
            onChangeText={(text) => updateField('titre', text)}
            placeholder="Titre de l'œuvre"
            multiline={false}
          />
        </View>
        <View style={styles.halfWidth}>
          <RichTextInput
            label="Auteur·ice / Édition utilisée"
            value={sheet.auteur}
            onChangeText={(text) => updateField('auteur', text)}
            placeholder="Auteur et édition"
            multiline={false}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.imageUpload, { borderColor: theme.primary }]}
        onPress={onImageUpload}
      >
        <ThemedText color="primary" style={styles.imageUploadText}>
          📷 Ajouter une image de couverture
        </ThemedText>
        <ThemedText color="textLight" style={styles.imageUploadSubtext}>
          Touchez pour sélectionner une image
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.additionalInfo}>
        <ThemedText variant="label" style={styles.sectionLabel}>
          Informations complémentaires
        </ThemedText>
        <ThemedView backgroundColor="background" style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <RichTextInput
              label="Genre littéraire"
              value=""
              onChangeText={() => {}}
              placeholder="Roman, théâtre, poésie..."
              multiline={false}
              style={styles.smallInput}
            />
            <RichTextInput
              label="Date de publication"
              value=""
              onChangeText={() => {}}
              placeholder="Année"
              multiline={false}
              style={styles.smallInput}
            />
          </View>
        </ThemedView>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  imageUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  imageUploadSubtext: {
    fontSize: 14,
  },
  additionalInfo: {
    marginTop: 16,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  infoGrid: {
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  smallInput: {
    minHeight: 50,
  },
});
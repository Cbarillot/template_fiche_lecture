import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ThemedTextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: 'body' | 'title' | 'subtitle' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'text' | 'textLight' | 'accent';
  numberOfLines?: number;
  onPress?: () => void;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  style,
  variant = 'body',
  color = 'text',
  numberOfLines,
  onPress,
}) => {
  const { theme } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      default:
        return styles.body;
    }
  };

  const getColorStyle = (): TextStyle => {
    return { color: theme[color] };
  };

  return (
    <Text
      style={[getVariantStyle(), getColorStyle(), style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
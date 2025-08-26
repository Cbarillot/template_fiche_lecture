import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ThemedViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  backgroundColor?: 'background' | 'card' | 'surface' | 'primary' | 'secondary';
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  children,
  style,
  backgroundColor = 'background',
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = (): ViewStyle => {
    return { backgroundColor: theme[backgroundColor] };
  };

  return (
    <View style={[getBackgroundColor(), style]}>
      {children}
    </View>
  );
};
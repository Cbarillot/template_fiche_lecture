import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { ThemeContext, useThemeProvider } from './src/hooks/useTheme';

const Stack = createStackNavigator();

const AppContent: React.FC = () => {
  const themeProvider = useThemeProvider();

  return (
    <ThemeContext.Provider value={themeProvider}>
      <SafeAreaProvider>
        <PaperProvider>
          <StatusBar
            barStyle={themeProvider.isDark ? 'light-content' : 'dark-content'}
            backgroundColor={themeProvider.theme.primary}
          />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
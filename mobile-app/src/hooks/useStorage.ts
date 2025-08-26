import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorage = () => {
  const saveData = async (key: string, data: any) => {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  };

  const loadData = async (key: string) => {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  };

  const removeData = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  };

  return {
    saveData,
    loadData,
    removeData,
    clearAll,
  };
};
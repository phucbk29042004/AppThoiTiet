// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "cities";

// Lưu danh sách thành phố
export const saveCities = async (cities: string[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch (e) {
    console.error("Lỗi khi lưu thành phố:", e);
  }
};

// Load danh sách thành phố
export const loadCities = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Lỗi khi load thành phố:", e);
    return [];
  }
};

// Xóa toàn bộ
export const clearCities = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Lỗi khi clear thành phố:", e);
  }
};

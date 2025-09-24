// screens/HomeScreen.tsx
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { saveCities, loadCities } from "../utils/storage";
import CityItem from "../components/CityItem";
import { Ionicons } from "@expo/vector-icons";

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const [cities, setCities] = useState<string[]>([]);
  const [newCity, setNewCity] = useState("");
  const [keyword, setKeyword] = useState("");

  // Logout button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF4500" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // 🟢 Load cities khi mở app
  useEffect(() => {
    (async () => {
      const stored = await loadCities();
      setCities(stored.length > 0 ? stored : ["Hà Nội", "Hồ Chí Minh"]);
    })();
  }, []);

  // 🟢 Lưu cities khi thay đổi
  useEffect(() => {
    saveCities(cities);
  }, [cities]);

  const addCity = () => {
    if (!newCity.trim()) {
      Alert.alert("Lỗi", "Tên thành phố không được để trống!");
      return;
    }
    if (cities.includes(newCity.trim())) {
      Alert.alert("Thông báo", "Thành phố đã tồn tại!");
      return;
    }
    setCities([...cities, newCity.trim()]);
    setNewCity("");
  };

  const handleDeleteCity = (city: string) => {
    Alert.alert("Xác nhận", `Bạn có muốn xóa ${city}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          const updated = cities.filter((c) => c !== city);
          setCities(updated);
          saveCities(updated);
        },
      },
    ]);
  };

  const filtered = cities.filter((c) =>
    c.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách thành phố</Text>

      {/* Ô tìm kiếm */}
      <TextInput
        style={styles.search}
        placeholder="Tìm kiếm..."
        value={keyword}
        onChangeText={setKeyword}
      />

      {/* Ô nhập city mới */}
      <View style={styles.addRow}>
        <TextInput
          style={[styles.search, { flex: 1, marginBottom: 0 }]}
          placeholder="Nhập thành phố mới..."
          value={newCity}
          onChangeText={setNewCity}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addCity}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách với swipe-to-delete */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CityItem
            name={item}
            onPress={() => navigation.navigate("Detail", { city: item })}
            onDelete={() => handleDeleteCity(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  search: {
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  addRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  addBtn: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
});
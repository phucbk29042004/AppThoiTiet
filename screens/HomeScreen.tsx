// screens/HomeScreen.tsx
import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { citiesVN } from "../utils/citiesVN";
import CityItem from "../components/CityItem";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [keyword, setKeyword] = useState("");

  // 🟢 Thêm nút Logout trên header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.replace("Login")}
          style={{ marginRight: 12 }}
        >
          <Text style={{ color: "#FF4500", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Lọc danh sách theo từ khóa
  const data = citiesVN.filter((c) =>
    c.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thành phố / Tỉnh (VN)</Text>
      <TextInput
        style={styles.search}
        placeholder="Tìm kiếm thành phố..."
        value={keyword}
        onChangeText={setKeyword}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CityItem
            name={item}
            onPress={() => navigation.navigate("Detail", { city: item })}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
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
});

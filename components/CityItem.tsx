// components/CityItem.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = { name: string; onPress: () => void };

export default function CityItem({ name, onPress }: Props) {
  // Giả lập icon thời tiết (bạn có thể đổi bằng data từ API nếu muốn)
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;
  const weatherIcon = isDay ? "sunny-outline" : "moon-outline";

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Ionicons name={weatherIcon as any} size={26} color="#FFB300" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.sub}>Chạm để xem chi tiết</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 2, color: "#333" },
  sub: { color: "#666", fontSize: 12 },
});

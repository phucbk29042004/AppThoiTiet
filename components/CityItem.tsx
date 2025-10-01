// components/CityItem.tsx
import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, Swipeable } from "react-native-gesture-handler";

type Props = { name: string; onPress: () => void; onDelete: () => void };

export default function CityItem({ name, onPress, onDelete }: Props) {
  // Nút xoá khi vuốt
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <RectButton style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={20} color="#fff" />
      </RectButton>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={22} color="#1E90FF" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.sub}>Chạm để xem chi tiết thời tiết</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
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
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
});

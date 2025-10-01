// components/CityItem.tsx
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, Swipeable } from "react-native-gesture-handler";

// === Bạn có thể chuyển 2 hằng số này sang config.ts sau nếu muốn ===
const OWM_API_KEY = "e64ad377551ef1eac9ed78fbfccb2b9a"; // ← key của bạn
const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Bỏ dấu tiếng Việt + chuẩn hoá so sánh
function removeVietnameseTones(str: string) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

type Props = {
  name: string;
  onPress: () => void;
  onDelete?: () => void;
};

type WeatherLite = {
  temp: number | null;
  desc: string | null;
  icon: string | null;
  ts: number; // timestamp cache
};

// Cache 10 phút trong bộ nhớ
const CACHE_TTL_MS = 10 * 60 * 1000;
const weatherCache = new Map<string, WeatherLite>();

export default function CityItem({ name, onPress, onDelete }: Props) {
  const [w, setW] = useState<WeatherLite | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch thời tiết cho từng thành phố
  useEffect(() => {
    let canceled = false;

    const fetchWeather = async () => {
      try {
        const key = `vn-${removeVietnameseTones(name)}`;
        const cached = weatherCache.get(key);
        if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
          if (!canceled) {
            setW(cached);
            setLoading(false);
          }
          return;
        }

        const q = `${encodeURIComponent(removeVietnameseTones(name))},VN`;
        const url = `${OWM_BASE_URL}/weather?q=${q}&units=metric&lang=vi&appid=${OWM_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Không lấy được thời tiết");

        const next: WeatherLite = {
          temp: typeof data?.main?.temp === "number" ? Math.round(data.main.temp) : null,
          desc: data?.weather?.[0]?.description ?? null,
          icon: data?.weather?.[0]?.icon ?? null,
          ts: Date.now(),
        };

        weatherCache.set(key, next);
        if (!canceled) setW(next);
      } catch (e) {
        if (!canceled) setW({ temp: null, desc: null, icon: null, ts: Date.now() });
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchWeather();
    return () => {
      canceled = true;
    };
  }, [name]);

  const renderRightActions = () =>
    onDelete ? (
      <RectButton style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={22} color="#fff" />
        <Text style={styles.deleteText}>Xoá</Text>
      </RectButton>
    ) : null;

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      enabled={!!onDelete}
    >
      <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
        {/* Trái: địa điểm + mô tả */}
        <View style={styles.left}>
          <View style={styles.locationBadge}>
            <Ionicons name="location-outline" size={18} color="#1E90FF" />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>

            {loading ? (
              <View style={styles.row}>
                <ActivityIndicator size="small" />
                <Text style={styles.sub}>  Đang tải thời tiết...</Text>
              </View>
            ) : w?.desc ? (
              <Text style={styles.sub} numberOfLines={1}>
                {w.desc}
              </Text>
            ) : (
              <Text style={styles.subMuted}>Không có dữ liệu thời tiết</Text>
            )}
          </View>
        </View>

        {/* Phải: nhiệt độ + icon */}
        <View style={styles.right}>
          {loading ? (
            <Text style={styles.tempMuted}>--°</Text>
          ) : (
            <Text style={styles.temp}>
              {typeof w?.temp === "number" ? `${w.temp}°` : "--°"}
            </Text>
          )}

          {w?.icon ? (
            <Image
              source={{ uri: `https://openweathermap.org/img/wn/${w.icon}@2x.png` }}
              style={styles.icon}
            />
          ) : (
            <Ionicons name="cloud-outline" size={26} color="#aaa" />
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 },
  locationBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  sub: { color: "#555", fontSize: 12, marginTop: 2 },
  subMuted: { color: "#999", fontSize: 12, marginTop: 2, fontStyle: "italic" },
  row: { flexDirection: "row", alignItems: "center" },
  right: { alignItems: "flex-end", justifyContent: "center" },
  temp: { fontSize: 22, fontWeight: "700", color: "#FF6B00", marginBottom: 2 },
  tempMuted: { fontSize: 22, fontWeight: "700", color: "#bbb", marginBottom: 2 },
  icon: { width: 36, height: 36, marginTop: 2 },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 88,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteText: { color: "#fff", fontWeight: "600", fontSize: 12, marginTop: 4 },
});

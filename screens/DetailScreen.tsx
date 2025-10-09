// screens/DetailScreen.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";

const API_KEY = "e64ad377551ef1eac9ed78fbfccb2b9a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Bỏ dấu tiếng Việt
function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

type DetailRouteProp = RouteProp<RootStackParamList, "Detail">;

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { city } = route.params;

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cityName = removeVietnameseTones(city);
        const url = `${BASE_URL}/weather?q=${encodeURIComponent(
          cityName
        )},VN&units=metric&lang=vi&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Không lấy được dữ liệu");
        console.log("Weather data:", data); // Debug
        setWeather(data);
      } catch (err: any) {
        console.error(err);
        Alert.alert("Lỗi", err?.message || "Không kết nối được tới OpenWeatherMap");
      } finally {
        setLoading(false);
      }
    })();
  }, [city]);

  // Helpers
  const toLocalTime = (unixSec?: number, shiftSec?: number) => {
    if (!unixSec || typeof shiftSec !== "number") return "--:--";
    const d = new Date((unixSec + shiftSec) * 1000);
    const hh = d.getUTCHours().toString().padStart(2, "0");
    const mm = d.getUTCMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const degToDir = (deg?: number) => {
    if (typeof deg !== "number") return "--";
    const dirs = ["B", "BĐ", "Đ", "NĐ", "N", "NT", "T", "BT"];
    const idx = Math.round(deg / 45) % 8;
    return dirs[idx];
  };

  const theme = useMemo(() => {
    const main: string = weather?.weather?.[0]?.main ?? "";
    if (/Thunderstorm/i.test(main))
      return ["#373B44", "#4286f4"] as const;
    if (/Rain|Drizzle/i.test(main))
      return ["#4e54c8", "#8f94fb"] as const;
    if (/Snow/i.test(main))
      return ["#83a4d4", "#b6fbff"] as const;
    if (/Cloud/i.test(main))
      return ["#2193b0", "#6dd5ed"] as const;
    if (/Clear/i.test(main))
      return ["#f7971e", "#ffd200"] as const;
    return ["#4568dc", "#b06ab3"] as const;
  }, [weather]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 8 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.center}>
        <Text>Không có dữ liệu!</Text>
      </View>
    );
  }

  // Lấy dữ liệu an toàn với giá trị mặc định
  const w = weather;
  const temp = Math.round(w.main?.temp ?? 0);
  const feels = Math.round(w.main?.feels_like ?? 0);
  const desc = w.weather?.[0]?.description ?? "N/A";
  const humidity = w.main?.humidity ?? 0;
  const wind = w.wind?.speed?.toFixed(2) ?? "0";
  const windDeg = w.wind?.deg;
  const pressure = w.main?.pressure ?? 0;
  const clouds = w.clouds?.all ?? 0;
  const visibility = typeof w.visibility === "number" ? (w.visibility / 1000).toFixed(1) : null;
  const icon = w.weather?.[0]?.icon;
  const sunrise = toLocalTime(w.sys?.sunrise, w.timezone);
  const sunset = toLocalTime(w.sys?.sunset, w.timezone);

  console.log("Parsed data:", { temp, feels, humidity, wind, pressure, clouds, visibility }); // Debug

  return (
    <LinearGradient colors={theme} style={styles.gradient}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Thẻ chính */}
        <View style={styles.card}>
          <Text style={styles.city}>{city}</Text>

          <View style={styles.mainRow}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.temp}>{temp}°</Text>
              <Text style={styles.desc}>{desc}</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              {icon ? (
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
                  style={styles.icon}
                />
              ) : (
                <Ionicons name="cloud-outline" size={110} color="#fff" />
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Grid chỉ số - QUAN TRỌNG */}
          <Text style={styles.sectionTitle}>Chi tiết thời tiết</Text>
          <View style={styles.grid}>
            <Stat icon="thermometer-outline" label="Cảm giác" value={`${feels}°C`} />
            <Stat icon="water-outline" label="Độ ẩm" value={`${humidity}%`} />
            <Stat icon="speedometer-outline" label="Áp suất" value={`${pressure} hPa`} />
            <Stat icon="cloud-outline" label="Mây" value={`${clouds}%`} />
            <Stat 
              icon="eye-outline" 
              label="Tầm nhìn" 
              value={visibility != null ? `${visibility} km` : "N/A"} 
            />
            <Stat 
              icon="navigate-outline" 
              label={`Gió ${degToDir(windDeg)}`} 
              value={`${wind} m/s`} 
            />
            <Stat icon="sunny-outline" label="Bình minh" value={sunrise} />
            <Stat icon="moon-outline" label="Hoàng hôn" value={sunset} />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/** Ô chỉ số nhỏ */
function Stat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color="#1E90FF" />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  city: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 12,
  },

  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  temp: { 
    fontSize: 68, 
    fontWeight: "900", 
    color: "#FF6B00", 
    lineHeight: 76,
  },
  desc: { 
    fontSize: 17, 
    color: "#334155", 
    marginTop: -8, 
    textTransform: "capitalize",
    fontWeight: "500",
  },
  icon: { 
    width: 130, 
    height: 130,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  stat: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "flex-start",
  },
  statLabel: { 
    marginTop: 6, 
    color: "#64748B", 
    fontSize: 13,
    fontWeight: "500",
  },
  statValue: { 
    marginTop: 4, 
    color: "#0F172A", 
    fontSize: 17, 
    fontWeight: "700",
  },
});
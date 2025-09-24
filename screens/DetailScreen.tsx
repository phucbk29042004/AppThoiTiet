// screens/DetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

const API_KEY = "e64ad377551ef1eac9ed78fbfccb2b9a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function DetailScreen({ route }: Props) {
  const { city } = route.params;
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const cityName = removeVietnameseTones(city);
        const url = `${BASE_URL}/weather?q=${encodeURIComponent(
          cityName
        )},VN&units=metric&lang=vi&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          setWeather(data);
        } else {
          Alert.alert("Lỗi", data.message || "Không lấy được dữ liệu");
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Lỗi", "Không kết nối được tới OpenWeatherMap");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải dữ liệu...</Text>
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

  const temp = Math.round(weather.main?.temp);
  const desc = weather.weather?.[0]?.description ?? "";
  const humidity = weather.main?.humidity;
  const wind = weather.wind?.speed;
  const icon = weather.weather?.[0]?.icon;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.city}>{city}</Text>
        {icon && (
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
            style={styles.icon}
          />
        )}
        <Text style={styles.temp}>{temp}°C</Text>
        <Text style={styles.desc}>{desc}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.info}>💧 Độ ẩm: {humidity}%</Text>
          <Text style={styles.info}>💨 Gió: {wind} m/s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f0fa",
    padding: 20,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  city: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#1E90FF" },
  icon: { width: 120, height: 120 },
  temp: { fontSize: 52, fontWeight: "bold", color: "#FF4500" },
  desc: { fontSize: 20, fontStyle: "italic", marginVertical: 10, color: "#555" },
  infoBox: { marginTop: 15 },
  info: { fontSize: 18, marginVertical: 4, color: "#333" },
});

// screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

const API_BASE = "http://172.20.10.8:5000"; // dùng cổng HTTP (5000) cho dễ test

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Thành công", `Xin chào ${data.user.name}`);
        // nếu muốn lưu token:
        // await AsyncStorage.setItem("token", data.token);
        navigation.replace("Home");
      } else {
        Alert.alert("Sai thông tin", data.msg || "Email hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể kết nối tới server!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤️ Weather App</Text>
      <Text style={styles.subtitle}>Đăng nhập để xem thời tiết</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>
          Chưa có tài khoản? <Text style={styles.link}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f0f4f8" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#1E90FF" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 30, color: "#666" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  loginBtn: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  registerText: { textAlign: "center", marginTop: 20, color: "#666" },
  link: { color: "#1E90FF", fontWeight: "bold" },
});

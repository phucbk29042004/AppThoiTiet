// navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerTitleAlign: "center" }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Đăng nhập" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Đăng ký" }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Danh sách thành phố" }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Chi tiết" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

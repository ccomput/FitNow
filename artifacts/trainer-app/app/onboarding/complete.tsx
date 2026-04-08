import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function OnboardingComplete() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentProfile, setStudentProfile } = useApp();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    setStudentProfile({ ...studentProfile, onboardingComplete: true });
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const items = [
    { icon: "user", label: `Perfil: ${studentProfile.name}` },
    { icon: "target", label: `Objetivo: ${studentProfile.goal}` },
    { icon: "activity", label: `Nível: ${studentProfile.level}` },
    { icon: "calendar", label: `Frequência: ${studentProfile.weeklyFrequency}` },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 20, paddingBottom: bottomPad + 24 }]}>
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.successCircle,
            { backgroundColor: colors.primary },
            { transform: [{ scale }], opacity },
          ]}
        >
          <Feather name="check" size={48} color="#FFFFFF" />
        </Animated.View>

        <Animated.View style={[{ opacity, alignItems: "center", gap: 8 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Perfil criado!</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Você está pronto para encontrar o personal ideal
          </Text>
        </Animated.View>

        <Animated.View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, opacity }]}>
          {items.map((item, i) => (
            <View key={i} style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.accent }]}>
                <Feather name={item.icon as any} size={14} color={colors.primary} />
              </View>
              <Text style={[styles.summaryText, { color: colors.foreground }]}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace("/(tabs)/")}
          activeOpacity={0.85}
        >
          <Feather name="map" size={18} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Encontrar personais</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: colors.border }]}
          onPress={() => router.push("/student/ficha")}
          activeOpacity={0.8}
        >
          <Text style={[styles.secondaryBtnText, { color: colors.mutedForeground }]}>Ver minha ficha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },
  successCircle: {
    width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center",
    shadowColor: "#FF5A1F", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  summaryCard: { width: "100%", borderRadius: 18, borderWidth: 1, padding: 16, gap: 12 },
  summaryItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  summaryIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  summaryText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  actions: { gap: 12 },
  primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  primaryBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  secondaryBtn: { paddingVertical: 14, borderRadius: 14, borderWidth: 1, alignItems: "center" },
  secondaryBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});

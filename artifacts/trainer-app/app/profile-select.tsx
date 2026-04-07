import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function ProfileSelectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUserType, studentProfile } = useApp();
  const scaleStudent = useRef(new Animated.Value(1)).current;
  const scalePersonal = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handlePress = (type: "student" | "personal", scaleAnim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setUserType(type);
      if (type === "student") {
        if (!studentProfile.onboardingComplete) {
          router.replace("/onboarding/welcome");
        } else {
          router.replace("/(tabs)/");
        }
      } else {
        router.replace("/(personal-tabs)/");
      }
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.darkSurface, paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.logoRow]}>
          <View style={styles.logoIcon}>
            <Feather name="zap" size={22} color="#FF5A1F" />
          </View>
          <Text style={styles.logoText}>FitNow</Text>
        </View>
        <Text style={styles.title}>Como você quer entrar?</Text>
        <Text style={styles.subtitle}>
          Escolha seu perfil para continuar
        </Text>
      </View>

      <View style={styles.cardsRow}>
        <Animated.View style={{ transform: [{ scale: scaleStudent }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.profileCard, { borderColor: "#FF5A1F", backgroundColor: "rgba(255,90,31,0.08)" }]}
            onPress={() => handlePress("student", scaleStudent)}
            activeOpacity={1}
          >
            <View style={[styles.cardIconBg, { backgroundColor: "rgba(255,90,31,0.15)" }]}>
              <Feather name="user" size={32} color="#FF5A1F" />
            </View>
            <Text style={styles.cardTitle}>Aluno</Text>
            <Text style={styles.cardDesc}>
              Busque personais, agende treinos e acompanhe sua evolução
            </Text>
            <View style={[styles.cardCta, { backgroundColor: "#FF5A1F" }]}>
              <Text style={styles.cardCtaText}>Entrar como aluno</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scalePersonal }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.profileCard, { borderColor: "#10B981", backgroundColor: "rgba(16,185,129,0.08)" }]}
            onPress={() => handlePress("personal", scalePersonal)}
            activeOpacity={1}
          >
            <View style={[styles.cardIconBg, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
              <Feather name="award" size={32} color="#10B981" />
            </View>
            <Text style={styles.cardTitle}>Personal</Text>
            <Text style={styles.cardDesc}>
              Gerencie sua agenda, alunos, reservas e treinos
            </Text>
            <View style={[styles.cardCta, { backgroundColor: "#10B981" }]}>
              <Text style={styles.cardCtaText}>Entrar como personal</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Text style={styles.footer}>
        FitNow · Personal trainer sob demanda
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", gap: 12, marginBottom: 40 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,90,31,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#FFFFFF", fontSize: 24, fontFamily: "Inter_700Bold" },
  title: { color: "#FFFFFF", fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  cardsRow: { flex: 1, gap: 16 },
  profileCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  cardTitle: { color: "#FFFFFF", fontSize: 22, fontFamily: "Inter_700Bold" },
  cardDesc: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  cardCta: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cardCtaText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.2)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 24,
  },
});

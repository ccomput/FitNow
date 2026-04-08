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
  const { setUserType, studentProfile, setStudentProfile } = useApp();
  const scaleStudent = useRef(new Animated.Value(1)).current;
  const scalePersonal = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const animateThen = (scaleAnim: Animated.Value, cb: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(cb);
  };

  const enterAsExistingStudent = () => {
    animateThen(scaleStudent, () => {
      setUserType("student");
      router.replace("/(tabs)/");
    });
  };

  const enterAsNewStudent = () => {
    animateThen(scaleStudent, () => {
      setUserType("student");
      setStudentProfile({ ...studentProfile, onboardingComplete: false, name: "", email: "" });
      router.replace("/onboarding/welcome");
    });
  };

  const enterAsPersonal = () => {
    animateThen(scalePersonal, () => {
      setUserType("personal");
      router.replace("/(personal-tabs)/");
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#1A1A2E", paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Feather name="zap" size={22} color="#FF5A1F" />
          </View>
          <Text style={styles.logoText}>FitNow</Text>
        </View>
        <Text style={styles.title}>Como você quer entrar?</Text>
        <Text style={styles.subtitle}>Escolha seu perfil para continuar</Text>
      </View>

      <View style={styles.cardsCol}>
        <Animated.View style={[{ transform: [{ scale: scaleStudent }] }]}>
          <View style={[styles.profileCard, { borderColor: "#FF5A1F", backgroundColor: "rgba(255,90,31,0.08)" }]}>
            <View style={styles.cardTop}>
              <View style={[styles.cardIconBg, { backgroundColor: "rgba(255,90,31,0.15)" }]}>
                <Feather name="user" size={28} color="#FF5A1F" />
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>Aluno</Text>
                <Text style={styles.cardDesc}>Busque personais, agende treinos e acompanhe sua evolução</Text>
              </View>
            </View>

            <View style={styles.cardBtns}>
              <TouchableOpacity
                style={[styles.cardBtnPrimary, { backgroundColor: "#FF5A1F" }]}
                onPress={enterAsExistingStudent}
                activeOpacity={0.85}
              >
                <Feather name="log-in" size={15} color="#FFFFFF" />
                <Text style={styles.cardBtnPrimaryText}>Entrar como aluno</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cardBtnSecondary, { borderColor: "rgba(255,90,31,0.4)" }]}
                onPress={enterAsNewStudent}
                activeOpacity={0.8}
              >
                <Feather name="user-plus" size={14} color="#FF5A1F" />
                <Text style={[styles.cardBtnSecondaryText, { color: "#FF5A1F" }]}>
                  Novo por aqui? Criar conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scalePersonal }] }}>
          <TouchableOpacity
            style={[styles.profileCard, styles.profileCardRow, { borderColor: "#10B981", backgroundColor: "rgba(16,185,129,0.08)" }]}
            onPress={enterAsPersonal}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIconBg, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
              <Feather name="award" size={28} color="#10B981" />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Personal Trainer</Text>
              <Text style={styles.cardDesc}>Gerencie agenda, alunos, reservas e treinos</Text>
            </View>
            <View style={[styles.cardArrow, { backgroundColor: "#10B981" }]}>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Text style={styles.footer}>FitNow · Personal trainer sob demanda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", gap: 12, marginBottom: 32 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,90,31,0.15)", alignItems: "center", justifyContent: "center",
  },
  logoText: { color: "#FFFFFF", fontSize: 24, fontFamily: "Inter_700Bold" },
  title: { color: "#FFFFFF", fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  cardsCol: { flex: 1, gap: 16, justifyContent: "center" },
  profileCard: { borderRadius: 20, borderWidth: 1.5, padding: 20, gap: 16 },
  profileCardRow: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 22 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 16 },
  cardIconBg: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  cardTextBlock: { flex: 1, gap: 4 },
  cardTitle: { color: "#FFFFFF", fontSize: 19, fontFamily: "Inter_700Bold" },
  cardDesc: { color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  cardBtns: { gap: 10 },
  cardBtnPrimary: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 13, borderRadius: 14,
  },
  cardBtnPrimaryText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cardBtnSecondary: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 11, borderRadius: 14, borderWidth: 1,
  },
  cardBtnSecondaryText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  cardArrow: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  footer: { textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 20 },
});

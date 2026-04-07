import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export default function OnboardingWelcome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const steps = [
    { icon: "user", label: "Dados pessoais" },
    { icon: "target", label: "Seu objetivo" },
    { icon: "activity", label: "Dados físicos" },
    { icon: "heart", label: "Saúde" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 20, paddingBottom: bottomPad + 20 }]}>
      <View style={styles.topSection}>
        <View style={[styles.iconBg, { backgroundColor: colors.accent }]}>
          <Feather name="zap" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Bem-vindo ao FitNow!
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Vamos montar seu perfil para conectar você com os melhores personais da sua região.
        </Text>
      </View>

      <View style={styles.stepsSection}>
        <Text style={[styles.stepsTitle, { color: colors.mutedForeground }]}>
          O que você vai preencher:
        </Text>
        <View style={styles.stepsList}>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepIconBg, { backgroundColor: colors.secondary }]}>
                <Feather name={step.icon as any} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.stepLabel, { color: colors.foreground }]}>{step.label}</Text>
              <Feather name="check" size={14} color={colors.muted} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.progress}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              { backgroundColor: i === 1 ? colors.primary : colors.muted },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/onboarding/basic")}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Começar</Text>
        <Feather name="arrow-right" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  topSection: { alignItems: "center", gap: 16, flex: 1, justifyContent: "center" },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  stepsSection: { gap: 12 },
  stepsTitle: { fontSize: 13, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  stepsList: { gap: 10 },
  stepItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepIconBg: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stepLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  progress: { flexDirection: "row", justifyContent: "center", gap: 8 },
  progressDot: { width: 8, height: 8, borderRadius: 4 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

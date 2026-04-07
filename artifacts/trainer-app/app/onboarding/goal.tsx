import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const GOALS = [
  { id: "Emagrecimento", icon: "trending-down", desc: "Perder peso e reduzir gordura" },
  { id: "Hipertrofia", icon: "trending-up", desc: "Ganhar massa muscular" },
  { id: "Condicionamento", icon: "activity", desc: "Melhorar resistência e forma física" },
  { id: "Mobilidade", icon: "wind", desc: "Aumentar flexibilidade e mobilidade" },
  { id: "Reabilitação", icon: "heart", desc: "Recuperar de lesão ou cirurgia" },
  { id: "Performance", icon: "zap", desc: "Maximizar rendimento esportivo" },
  { id: "Saúde geral", icon: "shield", desc: "Manter saúde e qualidade de vida" },
];

const FREQUENCIES = ["1x por semana", "2x por semana", "3x por semana", "4x por semana", "5x ou mais"];

export default function OnboardingGoal() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentProfile, setStudentProfile } = useApp();

  const [goal, setGoal] = useState(studentProfile.goal);
  const [frequency, setFrequency] = useState(studentProfile.weeklyFrequency || "3x por semana");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = () => {
    setStudentProfile({ ...studentProfile, goal, weeklyFrequency: frequency });
    router.push("/onboarding/physical");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[styles.progressSeg, { backgroundColor: i <= 3 ? colors.primary : colors.muted }]} />
          ))}
        </View>
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>3 / 5</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Qual seu objetivo?</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Isso ajuda o personal a planejar melhor seu treino</Text>

        <View style={styles.goalsGrid}>
          {GOALS.map((g) => {
            const isSelected = goal === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => setGoal(g.id)}
                style={[
                  styles.goalCard,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.goalIcon, { backgroundColor: isSelected ? colors.primary : colors.secondary }]}>
                  <Feather name={g.icon as any} size={18} color={isSelected ? "#FFFFFF" : colors.mutedForeground} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalName, { color: isSelected ? colors.primary : colors.foreground }]}>{g.id}</Text>
                  <Text style={[styles.goalDesc, { color: colors.mutedForeground }]}>{g.desc}</Text>
                </View>
                {isSelected && <Feather name="check-circle" size={18} color={colors.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.freqSection}>
          <Text style={[styles.freqTitle, { color: colors.foreground }]}>Frequência semanal</Text>
          <View style={styles.freqGrid}>
            {FREQUENCIES.map((f) => {
              const isSelected = frequency === f;
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFrequency(f)}
                  style={[
                    styles.freqChip,
                    { backgroundColor: isSelected ? colors.primary : colors.card, borderColor: isSelected ? colors.primary : colors.border },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.freqText, { color: isSelected ? "#FFFFFF" : colors.foreground }]}>{f}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: goal ? colors.primary : colors.muted }]}
          onPress={handleNext}
          disabled={!goal}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, { color: goal ? "#FFFFFF" : colors.mutedForeground }]}>Próximo</Text>
          <Feather name="arrow-right" size={18} color={goal ? "#FFFFFF" : colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  progressBar: { flex: 1, flexDirection: "row", gap: 4 },
  progressSeg: { flex: 1, height: 3, borderRadius: 2 },
  stepLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  scroll: { paddingHorizontal: 20, gap: 8, paddingTop: 8 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 8 },
  goalsGrid: { gap: 10, marginTop: 8 },
  goalCard: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1,
  },
  goalIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  goalInfo: { flex: 1 },
  goalName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  goalDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  freqSection: { gap: 12, marginTop: 12 },
  freqTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  freqGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  freqChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  freqText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  nextBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const LEVELS = [
  { id: "Iniciante", desc: "Menos de 1 ano de treino" },
  { id: "Intermediário", desc: "1 a 3 anos de treino" },
  { id: "Avançado", desc: "Mais de 3 anos de treino" },
];

export default function OnboardingPhysical() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentProfile, setStudentProfile } = useApp();

  const [height, setHeight] = useState(studentProfile.height);
  const [weight, setWeight] = useState(studentProfile.weight);
  const [level, setLevel] = useState<"Iniciante" | "Intermediário" | "Avançado">(studentProfile.level);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = () => {
    setStudentProfile({ ...studentProfile, height, weight, level });
    router.push("/onboarding/health");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[styles.progressSeg, { backgroundColor: i <= 4 ? colors.primary : colors.muted }]} />
          ))}
        </View>
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>4 / 5</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Dados físicos</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Informações para o seu personal acompanhar sua evolução</Text>

        <View style={styles.measureRow}>
          <View style={[styles.measureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="arrow-up" size={20} color={colors.primary} />
            <TextInput
              style={[styles.measureInput, { color: colors.foreground }]}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="178"
              placeholderTextColor={colors.mutedForeground}
            />
            <Text style={[styles.measureUnit, { color: colors.mutedForeground }]}>cm</Text>
            <Text style={[styles.measureLabel, { color: colors.mutedForeground }]}>Altura</Text>
          </View>

          <View style={[styles.measureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="disc" size={20} color={colors.primary} />
            <TextInput
              style={[styles.measureInput, { color: colors.foreground }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="80"
              placeholderTextColor={colors.mutedForeground}
            />
            <Text style={[styles.measureUnit, { color: colors.mutedForeground }]}>kg</Text>
            <Text style={[styles.measureLabel, { color: colors.mutedForeground }]}>Peso</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Nível de treino</Text>
          <View style={styles.levelsCol}>
            {LEVELS.map((l) => {
              const isSelected = level === l.id;
              return (
                <TouchableOpacity
                  key={l.id}
                  onPress={() => setLevel(l.id as any)}
                  style={[
                    styles.levelCard,
                    { backgroundColor: isSelected ? colors.accent : colors.card, borderColor: isSelected ? colors.primary : colors.border },
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.levelInfo}>
                    <Text style={[styles.levelName, { color: isSelected ? colors.primary : colors.foreground }]}>{l.id}</Text>
                    <Text style={[styles.levelDesc, { color: colors.mutedForeground }]}>{l.desc}</Text>
                  </View>
                  {isSelected && <Feather name="check-circle" size={18} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>Próximo</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
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
  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 8 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  measureRow: { flexDirection: "row", gap: 14 },
  measureCard: {
    flex: 1, padding: 20, borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 4,
  },
  measureInput: { fontSize: 36, fontFamily: "Inter_700Bold", textAlign: "center" },
  measureUnit: { fontSize: 14, fontFamily: "Inter_400Regular" },
  measureLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 4 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  levelsCol: { gap: 10 },
  levelCard: {
    flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, borderWidth: 1,
  },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  levelDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  nextBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

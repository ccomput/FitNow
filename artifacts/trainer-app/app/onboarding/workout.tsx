import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import type { WorkoutExercise } from "@/context/AppContext";

type WorkoutChoice = "has_workout" | "no_workout" | "wants_personal";

export default function OnboardingWorkout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setWorkout } = useApp();

  const [choice, setChoice] = useState<WorkoutChoice | null>(null);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutFocus, setWorkoutFocus] = useState("Hipertrofia");
  const [division, setDivision] = useState("");
  const [observations, setObservations] = useState("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    { name: "", sets: "3", reps: "10-12" },
  ]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const FOCUS_OPTIONS = ["Hipertrofia", "Emagrecimento", "Condicionamento", "Mobilidade", "Força"];

  const addExercise = () => setExercises((prev) => [...prev, { name: "", sets: "3", reps: "10-12" }]);
  const updateExercise = (i: number, field: keyof WorkoutExercise, value: string) =>
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex)));

  const handleNext = () => {
    if (choice === "has_workout") {
      setWorkout({
        id: Date.now().toString(),
        name: workoutName || "Meu treino",
        focus: workoutFocus,
        division: division || "Não especificado",
        observations,
        exercises: exercises.filter((e) => e.name.trim()),
        updatedAt: new Date().toISOString().split("T")[0],
        origin: "student",
        updatedBy: "Você",
        trainerName: "",
        history: [
          {
            date: new Date().toISOString().split("T")[0],
            action: "Treino informado pelo aluno no cadastro",
            by: "Você",
            byType: "student",
          },
        ],
      });
    } else if (choice === "no_workout" || choice === "wants_personal") {
      setWorkout(null);
    }
    router.push("/onboarding/complete");
  };

  const OPTIONS: { id: WorkoutChoice; icon: string; title: string; desc: string; color: string }[] = [
    {
      id: "has_workout",
      icon: "file-text",
      title: "Sim, tenho um treino",
      desc: "Quero informar meu treino atual no app",
      color: "#3B82F6",
    },
    {
      id: "no_workout",
      icon: "x-circle",
      title: "Não, quero começar sem treino",
      desc: "Vou esperar um personal montar meu treino",
      color: "#6B7280",
    },
    {
      id: "wants_personal",
      icon: "award",
      title: "Quero que um personal monte",
      desc: "Vou contratar um personal e ele cria meu treino",
      color: "#FF5A1F",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={[styles.progressSeg, { backgroundColor: i <= 5 ? colors.primary : colors.muted }]} />
          ))}
        </View>
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>5 / 6</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Você já tem um treino?</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Seu treino fica centralizado no FitNow. Personais que você contratar poderão visualizá-lo e dar continuidade.
        </Text>

        <View style={styles.optionsList}>
          {OPTIONS.map((opt) => {
            const isSelected = choice === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setChoice(opt.id)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isSelected ? colors.card : colors.background,
                    borderColor: isSelected ? opt.color : colors.border,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: isSelected ? opt.color + "18" : colors.secondary }]}>
                  <Feather name={opt.icon as any} size={20} color={isSelected ? opt.color : colors.mutedForeground} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, { color: isSelected ? opt.color : colors.foreground }]}>{opt.title}</Text>
                  <Text style={[styles.optionDesc, { color: colors.mutedForeground }]}>{opt.desc}</Text>
                </View>
                {isSelected && <Feather name="check-circle" size={18} color={opt.color} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {choice === "has_workout" && (
          <View style={styles.workoutForm}>
            <View style={[styles.formDivider, { borderTopColor: colors.border }]} />
            <Text style={[styles.formTitle, { color: colors.foreground }]}>Cadastrar treino atual</Text>
            <Text style={[styles.formHint, { color: colors.mutedForeground }]}>
              Informe de forma resumida. Você pode editar depois.
            </Text>

            <TextInput
              style={[styles.inputField, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="Nome do treino (ex: Musculação 4x)"
              placeholderTextColor={colors.mutedForeground}
            />

            <View style={styles.focusWrap}>
              <Text style={[styles.focusLabel, { color: colors.mutedForeground }]}>Foco</Text>
              <View style={styles.focusGrid}>
                {FOCUS_OPTIONS.map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setWorkoutFocus(f)}
                    style={[
                      styles.focusChip,
                      { backgroundColor: workoutFocus === f ? colors.accent : colors.secondary, borderColor: workoutFocus === f ? colors.primary : "transparent", borderWidth: 1 },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.focusChipText, { color: workoutFocus === f ? colors.primary : colors.foreground }]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={[styles.inputField, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={division}
              onChangeText={setDivision}
              placeholder="Divisão (ex: Push/Pull/Legs, A/B)"
              placeholderTextColor={colors.mutedForeground}
            />

            <View style={styles.exercisesSection}>
              <View style={styles.exercisesSectionHeader}>
                <Text style={[styles.focusLabel, { color: colors.mutedForeground }]}>Exercícios (opcional)</Text>
                <TouchableOpacity onPress={addExercise} style={[styles.addExBtn, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
                  <Feather name="plus" size={12} color="#FFFFFF" />
                  <Text style={styles.addExBtnText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
              {exercises.map((ex, i) => (
                <View key={i} style={[styles.exRow, { backgroundColor: colors.secondary }]}>
                  <TextInput
                    style={[styles.exNameInput, { color: colors.foreground }]}
                    value={ex.name}
                    onChangeText={(v) => updateExercise(i, "name", v)}
                    placeholder={`Exercício ${i + 1}`}
                    placeholderTextColor={colors.mutedForeground}
                  />
                  <TextInput
                    style={[styles.exSmallInput, { color: colors.foreground }]}
                    value={ex.sets}
                    onChangeText={(v) => updateExercise(i, "sets", v)}
                    keyboardType="numeric"
                    placeholder="Séries"
                    placeholderTextColor={colors.mutedForeground}
                  />
                  <TextInput
                    style={[styles.exSmallInput, { color: colors.foreground }]}
                    value={ex.reps}
                    onChangeText={(v) => updateExercise(i, "reps", v)}
                    placeholder="Reps"
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
              ))}
            </View>

            <TextInput
              style={[styles.obsInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={observations}
              onChangeText={setObservations}
              placeholder="Observações sobre o treino (opcional)"
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={2}
            />
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: choice ? colors.primary : colors.muted }]}
          onPress={handleNext}
          disabled={!choice}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, { color: choice ? "#FFFFFF" : colors.mutedForeground }]}>Próximo</Text>
          <Feather name="arrow-right" size={18} color={choice ? "#FFFFFF" : colors.mutedForeground} />
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
  scroll: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  optionsList: { gap: 10 },
  optionCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, borderWidth: 1 },
  optionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  optionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  optionDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  workoutForm: { gap: 12 },
  formDivider: { borderTopWidth: StyleSheet.hairlineWidth },
  formTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  formHint: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: -4 },
  inputField: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, fontFamily: "Inter_400Regular" },
  focusWrap: { gap: 6 },
  focusLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  focusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  focusChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  focusChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  exercisesSection: { gap: 8 },
  exercisesSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  addExBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  addExBtnText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  exRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10 },
  exNameInput: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  exSmallInput: { width: 52, fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  obsInput: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, fontFamily: "Inter_400Regular", minHeight: 60, textAlignVertical: "top" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  nextBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

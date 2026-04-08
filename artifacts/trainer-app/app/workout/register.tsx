import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import type { WorkoutExercise } from "@/context/AppContext";

export default function WorkoutRegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setWorkout } = useApp();

  const [name, setName] = useState("");
  const [focus, setFocus] = useState("Hipertrofia");
  const [division, setDivision] = useState("");
  const [observations, setObservations] = useState("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    { name: "", sets: "3", reps: "10-12" },
  ]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const FOCUS_OPTIONS = ["Hipertrofia", "Emagrecimento", "Condicionamento", "Mobilidade", "Reabilitação", "Força"];

  const addExercise = () => setExercises((prev) => [...prev, { name: "", sets: "3", reps: "10-12" }]);
  const updateExercise = (i: number, field: keyof WorkoutExercise, value: string) =>
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex)));
  const removeExercise = (i: number) => setExercises((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    setWorkout({
      id: Date.now().toString(),
      name: name || "Meu treino",
      focus,
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
          action: "Treino informado pelo aluno",
          by: "Você",
          byType: "student",
        },
      ],
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Informar treino atual</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Cadastre seu treino existente no FitNow
          </Text>
        </View>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoBanner, { backgroundColor: colors.accent }]}>
        <Feather name="info" size={13} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.primary }]}>
          Personais que você contratar no FitNow poderão visualizar e ajustar este treino.
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Informações gerais</Text>

          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Nome do treino</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.foreground }]}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Meu treino de musculação"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Foco / objetivo</Text>
            <View style={styles.focusGrid}>
              {FOCUS_OPTIONS.map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFocus(f)}
                  style={[
                    styles.focusChip,
                    { backgroundColor: focus === f ? colors.accent : colors.secondary, borderColor: focus === f ? colors.primary : "transparent", borderWidth: 1 },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.focusChipText, { color: focus === f ? colors.primary : colors.foreground }]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Divisão (opcional)</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.foreground }]}
              value={division}
              onChangeText={setDivision}
              placeholder="Ex: A/B, Push/Pull/Legs, Full Body"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Exercícios</Text>
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={addExercise} activeOpacity={0.8}>
              <Feather name="plus" size={14} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>
            Informe os principais exercícios do seu treino. Pode ser resumido.
          </Text>

          {exercises.map((ex, i) => (
            <View key={i} style={[styles.exerciseCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <View style={styles.exerciseCardHeader}>
                <View style={[styles.exNum, { backgroundColor: colors.primary }]}>
                  <Text style={styles.exNumText}>{i + 1}</Text>
                </View>
                <TouchableOpacity onPress={() => removeExercise(i)} activeOpacity={0.7}>
                  <Feather name="trash-2" size={15} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.exInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                value={ex.name}
                onChangeText={(v) => updateExercise(i, "name", v)}
                placeholder="Nome do exercício"
                placeholderTextColor={colors.mutedForeground}
              />
              <View style={styles.setsRepsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.exLabel, { color: colors.mutedForeground }]}>Séries</Text>
                  <TextInput
                    style={[styles.exInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                    value={ex.sets}
                    onChangeText={(v) => updateExercise(i, "sets", v)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.exLabel, { color: colors.mutedForeground }]}>Repetições</Text>
                  <TextInput
                    style={[styles.exInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                    value={ex.reps}
                    onChangeText={(v) => updateExercise(i, "reps", v)}
                    placeholder="10-12"
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Observações (opcional)</Text>
          <TextInput
            style={[styles.obsInput, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.foreground }]}
            value={observations}
            onChangeText={setObservations}
            placeholder="Ex: Treino feito 3x na semana, foco em hipertrofia..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  headerSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  infoBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 16, paddingVertical: 10, marginHorizontal: 16, borderRadius: 10, marginBottom: 8 },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  scroll: { paddingHorizontal: 16, gap: 16 },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sectionHint: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: -4 },
  fieldBlock: { gap: 6 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular" },
  focusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  focusChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  focusChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  addBtnText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  exerciseCard: { borderRadius: 12, borderWidth: 1, padding: 12, gap: 8 },
  exerciseCardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  exNum: { width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  exNumText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_700Bold" },
  exInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontFamily: "Inter_400Regular" },
  exLabel: { fontSize: 10, fontFamily: "Inter_400Regular", marginBottom: 4 },
  setsRepsRow: { flexDirection: "row", gap: 10 },
  obsInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 13, fontFamily: "Inter_400Regular", minHeight: 70, textAlignVertical: "top" },
});

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

export default function WorkoutEditScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { workout, setWorkout } = useApp();

  const [name, setName] = useState(workout?.name ?? "Novo Treino");
  const [focus, setFocus] = useState(workout?.focus ?? "Hipertrofia");
  const [division, setDivision] = useState(workout?.division ?? "Push/Pull/Legs");
  const [observations, setObservations] = useState(workout?.observations ?? "");
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    workout?.exercises ?? [{ name: "", sets: "3", reps: "10-12" }]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const addExercise = () => setExercises((prev) => [...prev, { name: "", sets: "3", reps: "10-12" }]);

  const updateExercise = (i: number, field: keyof WorkoutExercise, value: string) => {
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex)));
  };

  const removeExercise = (i: number) => setExercises((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    setWorkout({
      id: workout?.id ?? Date.now().toString(),
      name,
      focus,
      division,
      observations,
      exercises: exercises.filter((e) => e.name.trim()),
      updatedAt: new Date().toISOString().split("T")[0],
      trainerName: "Carlos Mendes",
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {workout ? "Editar treino" : "Novo treino"}
        </Text>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#10B981" }]} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Informações gerais</Text>
          <Field label="Nome do treino" value={name} onChangeText={setName} colors={colors} />
          <Field label="Foco" value={focus} onChangeText={setFocus} colors={colors} />
          <Field label="Divisão" value={division} onChangeText={setDivision} colors={colors} placeholder="Ex: Push/Pull/Legs" />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.exerciseHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Exercícios</Text>
            <TouchableOpacity
              style={[styles.addExBtn, { backgroundColor: "#10B981" }]}
              onPress={addExercise}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={14} color="#FFFFFF" />
              <Text style={styles.addExBtnText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((ex, i) => (
            <View key={i} style={[styles.exerciseCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <View style={styles.exerciseCardHeader}>
                <View style={[styles.exNum, { backgroundColor: colors.primary }]}>
                  <Text style={styles.exNumText}>{i + 1}</Text>
                </View>
                <TouchableOpacity onPress={() => removeExercise(i)} activeOpacity={0.7}>
                  <Feather name="trash-2" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Field
                label="Nome do exercício"
                value={ex.name}
                onChangeText={(v: string) => updateExercise(i, "name", v)}
                colors={colors}
                placeholder="Ex: Supino Reto com Barra"
              />
              <View style={styles.setsRepsRow}>
                <View style={{ flex: 1 }}>
                  <Field label="Séries" value={ex.sets} onChangeText={(v: string) => updateExercise(i, "sets", v)} keyboardType="numeric" colors={colors} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Repetições" value={ex.reps} onChangeText={(v: string) => updateExercise(i, "reps", v)} colors={colors} placeholder="10-12" />
                </View>
              </View>
              <Field
                label="Observação (opcional)"
                value={ex.obs ?? ""}
                onChangeText={(v: string) => updateExercise(i, "obs", v)}
                colors={colors}
                placeholder="Ex: Carga progressiva"
              />
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Observações gerais</Text>
          <TextInput
            style={[styles.obsInput, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.foreground }]}
            value={observations}
            onChangeText={setObservations}
            placeholder="Ex: Descanso de 90s entre séries..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, keyboardType, placeholder, colors }: any) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        placeholder={placeholder ?? label}
        placeholderTextColor={colors.mutedForeground}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontFamily: "Inter_600SemiBold" },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 16, gap: 16 },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  fieldBlock: { gap: 5 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular" },
  exerciseHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  addExBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  addExBtnText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  exerciseCard: { borderRadius: 12, borderWidth: 1, padding: 12, gap: 10 },
  exerciseCardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  exNum: { width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  exNumText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_700Bold" },
  setsRepsRow: { flexDirection: "row", gap: 10 },
  obsInput: {
    borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 13,
    fontFamily: "Inter_400Regular", minHeight: 80, textAlignVertical: "top",
  },
});

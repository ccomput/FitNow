import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import type { WorkoutExercise } from "@/context/AppContext";

const STUDENTS_META: Record<string, { name: string; goal: string; level: string }> = {
  s1: { name: "Victor Santos", goal: "Hipertrofia", level: "Intermediário" },
  s2: { name: "Ana Lima", goal: "Emagrecimento", level: "Iniciante" },
  s3: { name: "Rodrigo Meireles", goal: "Musculação", level: "Avançado" },
  s4: { name: "Beatriz Souza", goal: "Mobilidade", level: "Iniciante" },
  s5: { name: "Carlos Almeida", goal: "Condicionamento", level: "Intermediário" },
};

export default function WorkoutEditScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { workout, setWorkout } = useApp();
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();

  const studentMeta = studentId ? STUDENTS_META[studentId] : null;
  const isCreatingNew = !workout;

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

  const buildNewWorkout = (origin: "personal_created" | "personal_adjusted") => ({
    id: workout?.id ?? Date.now().toString(),
    name,
    focus,
    division,
    observations,
    exercises: exercises.filter((e) => e.name.trim()),
    updatedAt: new Date().toISOString().split("T")[0],
    origin,
    updatedBy: "Carlos Mendes",
    trainerName: "Carlos Mendes",
    history: [
      ...(workout?.history ?? []),
      {
        date: new Date().toISOString().split("T")[0],
        action: origin === "personal_created"
          ? `Novo treino criado por personal`
          : `Treino ajustado por personal`,
        by: "Carlos Mendes",
        byType: "personal" as const,
      },
    ],
  });

  const handleSaveAdjust = () => {
    setWorkout(buildNewWorkout("personal_adjusted"));
    router.back();
  };

  const handleSaveNew = () => {
    setWorkout(buildNewWorkout("personal_created"));
    router.back();
  };

  const studentLabel = studentMeta
    ? `Treino de ${studentMeta.name}`
    : workout
    ? "Ajustar treino do aluno"
    : "Criar treino para aluno";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
          {studentLabel}
        </Text>
      </View>

      {studentMeta && (
        <View style={[styles.studentBanner, { backgroundColor: colors.darkSurface }]}>
          <View style={[styles.studentAvatarBg, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
            <Text style={styles.studentAvatarText}>{studentMeta.name[0]}</Text>
          </View>
          <View style={styles.studentBannerInfo}>
            <Text style={styles.studentBannerName}>{studentMeta.name}</Text>
            <View style={styles.studentBannerTags}>
              <View style={[styles.metaTag, { backgroundColor: "rgba(255,90,31,0.2)" }]}>
                <Text style={[styles.metaTagText, { color: "#FF5A1F" }]}>{studentMeta.goal}</Text>
              </View>
              <View style={[styles.metaTag, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
                <Text style={[styles.metaTagText, { color: "rgba(255,255,255,0.7)" }]}>{studentMeta.level}</Text>
              </View>
            </View>
          </View>
          {workout && (
            <View style={styles.currentWorkoutTag}>
              <Feather name="file-text" size={11} color="rgba(255,255,255,0.5)" />
              <Text style={styles.currentWorkoutTagText} numberOfLines={1}>
                {workout.name}
              </Text>
            </View>
          )}
        </View>
      )}

      {workout && (
        <View style={[styles.originBanner, { backgroundColor: colors.secondary }]}>
          <Feather name="info" size={13} color={colors.mutedForeground} />
          <Text style={[styles.originText, { color: colors.mutedForeground }]}>
            Treino ativo do aluno · Atualizado em{" "}
            {new Date(workout.updatedAt + "T00:00:00").toLocaleDateString("pt-BR")} por {workout.updatedBy}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Informações gerais</Text>
          <Field label="Nome do treino" value={name} onChangeText={setName} colors={colors} />
          <Field label="Foco / objetivo" value={focus} onChangeText={setFocus} colors={colors} />
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
                <View style={[styles.exNum, { backgroundColor: "#10B981" }]}>
                  <Text style={styles.exNumText}>{i + 1}</Text>
                </View>
                <TouchableOpacity onPress={() => removeExercise(i)} activeOpacity={0.7}>
                  <Feather name="trash-2" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Field label="Exercício" value={ex.name} onChangeText={(v: string) => updateExercise(i, "name", v)} colors={colors} placeholder="Ex: Supino Reto com Barra" />
              <View style={styles.setsRepsRow}>
                <View style={{ flex: 1 }}>
                  <Field label="Séries" value={ex.sets} onChangeText={(v: string) => updateExercise(i, "sets", v)} keyboardType="numeric" colors={colors} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Repetições" value={ex.reps} onChangeText={(v: string) => updateExercise(i, "reps", v)} colors={colors} placeholder="10-12" />
                </View>
              </View>
              <Field label="Observação (opcional)" value={ex.obs ?? ""} onChangeText={(v: string) => updateExercise(i, "obs", v)} colors={colors} placeholder="Ex: Carga progressiva" />
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Observações para o aluno</Text>
          <TextInput
            style={[styles.obsInput, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.foreground }]}
            value={observations}
            onChangeText={setObservations}
            placeholder="Ex: Descanso de 90s entre séries. Aumentar carga progressivamente."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        {workout ? (
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[styles.footerBtnSecondary, { borderColor: "#10B981" }]}
              onPress={handleSaveNew}
              activeOpacity={0.8}
            >
              <Feather name="plus-circle" size={15} color="#10B981" />
              <Text style={[styles.footerBtnSecondaryText, { color: "#10B981" }]}>Definir como novo treino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerBtnPrimary, { backgroundColor: "#10B981" }]}
              onPress={handleSaveAdjust}
              activeOpacity={0.85}
            >
              <Feather name="check" size={15} color="#FFFFFF" />
              <Text style={styles.footerBtnPrimaryText}>Salvar ajuste</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.footerBtnFull, { backgroundColor: "#10B981" }]}
            onPress={handleSaveNew}
            activeOpacity={0.85}
          >
            <Feather name="check-circle" size={16} color="#FFFFFF" />
            <Text style={styles.footerBtnPrimaryText}>Criar treino para o aluno</Text>
          </TouchableOpacity>
        )}
      </View>
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
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: "Inter_600SemiBold" },
  studentBanner: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 14, marginHorizontal: 0 },
  studentAvatarBg: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  studentAvatarText: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  studentBannerInfo: { flex: 1, gap: 5 },
  studentBannerName: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  studentBannerTags: { flexDirection: "row", gap: 6 },
  metaTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  metaTagText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  currentWorkoutTag: { flexDirection: "row", alignItems: "center", gap: 4, maxWidth: 100 },
  currentWorkoutTagText: { color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "Inter_400Regular" },
  originBanner: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10, marginHorizontal: 16, borderRadius: 10, marginBottom: 4 },
  originText: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular" },
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
  obsInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 13, fontFamily: "Inter_400Regular", minHeight: 80, textAlignVertical: "top" },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  footerActions: { flexDirection: "row", gap: 10 },
  footerBtnSecondary: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 13, borderRadius: 14, borderWidth: 1.5 },
  footerBtnSecondaryText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  footerBtnPrimary: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 13, borderRadius: 14 },
  footerBtnPrimaryText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  footerBtnFull: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 15, borderRadius: 14 },
});

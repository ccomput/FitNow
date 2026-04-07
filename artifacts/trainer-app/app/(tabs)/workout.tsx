import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function WorkoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { workout } = useApp();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  if (!workout) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 16 }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Meu treino</Text>
        </View>
        <View style={styles.empty}>
          <Feather name="file-text" size={48} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sem treino ativo</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
            Quando um personal criar um treino para você, ele aparecerá aqui.
          </Text>
          <TouchableOpacity
            style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/")}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>Encontrar um personal</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Meu treino</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Atualizado em {new Date(workout.updatedAt + "T00:00:00").toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <TouchableOpacity style={[styles.historyBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="clock" size={16} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.workoutCard, { backgroundColor: colors.darkSurface }]}>
          <View style={styles.workoutCardTop}>
            <View>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDivision}>{workout.division}</Text>
            </View>
            <View style={[styles.focusBadge, { backgroundColor: "rgba(255,90,31,0.2)" }]}>
              <Text style={styles.focusBadgeText}>{workout.focus}</Text>
            </View>
          </View>
          <View style={styles.trainerRow}>
            <Feather name="user" size={13} color="rgba(255,255,255,0.5)" />
            <Text style={styles.trainerText}>Por {workout.trainerName}</Text>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Exercícios</Text>
            <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
              {workout.exercises.length} exercícios
            </Text>
          </View>

          {workout.exercises.map((ex, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => toggle(i)}
              style={[
                styles.exerciseRow,
                { borderBottomColor: colors.border },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.exerciseNum, { backgroundColor: colors.accent }]}>
                <Text style={[styles.exerciseNumText, { color: colors.primary }]}>{i + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, { color: colors.foreground }]}>{ex.name}</Text>
                <Text style={[styles.exerciseSets, { color: colors.mutedForeground }]}>
                  {ex.sets} séries × {ex.reps} reps
                </Text>
                {expanded[i] && ex.obs && (
                  <View style={[styles.obsBox, { backgroundColor: colors.secondary }]}>
                    <Feather name="info" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.obsText, { color: colors.mutedForeground }]}>{ex.obs}</Text>
                  </View>
                )}
              </View>
              <Feather
                name={expanded[i] ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          ))}
        </View>

        {workout.observations ? (
          <View style={[styles.obsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.obsCardHeader}>
              <Feather name="file-text" size={15} color={colors.primary} />
              <Text style={[styles.obsCardTitle, { color: colors.foreground }]}>Observações do personal</Text>
            </View>
            <Text style={[styles.obsCardText, { color: colors.mutedForeground }]}>{workout.observations}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.checkinBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/checkin/today")}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={18} color="#FFFFFF" />
          <Text style={styles.checkinBtnText}>Registrar treino de hoje</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  historyBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 16, gap: 14 },
  workoutCard: { borderRadius: 18, padding: 20, gap: 12 },
  workoutCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  workoutName: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold", flex: 1 },
  workoutDivision: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },
  focusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  focusBadgeText: { color: "#FF5A1F", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  trainerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  trainerText: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "Inter_400Regular" },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sectionCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  exerciseRow: {
    flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  exerciseNum: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  exerciseNumText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  exerciseInfo: { flex: 1, gap: 2 },
  exerciseName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  exerciseSets: { fontSize: 12, fontFamily: "Inter_400Regular" },
  obsBox: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8, borderRadius: 8, marginTop: 6 },
  obsText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  obsCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  obsCardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  obsCardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  obsCardText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  checkinBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, borderRadius: 14,
  },
  checkinBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_600SemiBold" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  emptyBtn: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  emptyBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

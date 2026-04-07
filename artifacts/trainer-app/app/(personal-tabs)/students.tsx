import React from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { TrainerImage } from "@/components/TrainerImage";

const MOCK_STUDENTS = [
  {
    id: "s1",
    name: "Victor Santos",
    age: 30,
    goal: "Hipertrofia",
    level: "Intermediário",
    totalSessions: 12,
    lastSession: "2026-04-10",
    imageKey: "trainer1" as const,
    workout: "Push/Pull/Legs",
  },
  {
    id: "s2",
    name: "Ana Lima",
    age: 27,
    goal: "Emagrecimento",
    level: "Iniciante",
    totalSessions: 8,
    lastSession: "2026-04-09",
    imageKey: "trainer2" as const,
    workout: "Full Body A/B",
  },
  {
    id: "s3",
    name: "Rodrigo Meireles",
    age: 35,
    goal: "Musculação",
    level: "Avançado",
    totalSessions: 24,
    lastSession: "2026-04-08",
    imageKey: "trainer3" as const,
    workout: "Bro Split 5 dias",
  },
  {
    id: "s4",
    name: "Beatriz Souza",
    age: 32,
    goal: "Mobilidade",
    level: "Iniciante",
    totalSessions: 5,
    lastSession: "2026-04-07",
    imageKey: "trainer2" as const,
    workout: "Mobilidade e Pilates",
  },
  {
    id: "s5",
    name: "Carlos Almeida",
    age: 22,
    goal: "Condicionamento",
    level: "Intermediário",
    totalSessions: 16,
    lastSession: "2026-04-06",
    imageKey: "trainer1" as const,
    workout: "HIIT + Funcional",
  },
];

const LEVEL_COLORS = {
  "Iniciante": "#3B82F6",
  "Intermediário": "#F59E0B",
  "Avançado": "#10B981",
};

export default function PersonalStudentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Meus alunos</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{MOCK_STUDENTS.length} alunos ativos</Text>
      </View>

      <FlatList
        data={MOCK_STUDENTS}
        keyExtractor={(s) => s.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item: student }) => {
          const levelColor = LEVEL_COLORS[student.level as keyof typeof LEVEL_COLORS] ?? colors.primary;
          return (
            <TouchableOpacity
              style={[styles.studentCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/personal/student-file/${student.id}`)}
              activeOpacity={0.8}
            >
              <TrainerImage imageKey={student.imageKey} style={styles.studentPhoto} />
              <View style={styles.studentInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.studentName, { color: colors.foreground }]}>{student.name}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: levelColor + "20" }]}>
                    <Text style={[styles.levelBadgeText, { color: levelColor }]}>{student.level}</Text>
                  </View>
                </View>
                <Text style={[styles.goalText, { color: colors.mutedForeground }]}>
                  {student.age} anos · {student.goal}
                </Text>
                <View style={[styles.workoutRow, { backgroundColor: colors.secondary }]}>
                  <Feather name="file-text" size={11} color={colors.mutedForeground} />
                  <Text style={[styles.workoutText, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {student.workout}
                  </Text>
                </View>
                <View style={styles.statsRow}>
                  <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                    {student.totalSessions} sessões
                  </Text>
                  <Text style={[styles.statDot, { color: colors.muted }]}>·</Text>
                  <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                    Última: {new Date(student.lastSession + "T00:00:00").toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionIconBtn, { backgroundColor: colors.accent }]}
                  onPress={() => router.push(`/personal/workout-edit?studentId=${student.id}`)}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={15} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, gap: 2 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  list: { paddingHorizontal: 16 },
  studentCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 14, borderRadius: 18, borderWidth: 1,
  },
  studentPhoto: { width: 60, height: 72, borderRadius: 12, resizeMode: "cover" },
  studentInfo: { flex: 1, gap: 5 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  studentName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  levelBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  goalText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  workoutRow: {
    flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start",
  },
  workoutText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statDot: { fontSize: 11 },
  actions: { gap: 6 },
  actionIconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});

import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { TrainerImage } from "@/components/TrainerImage";

const STUDENTS: Record<string, any> = {
  s1: {
    name: "Victor Santos",
    age: 30,
    height: "178cm",
    weight: "80kg",
    goal: "Hipertrofia",
    level: "Intermediário",
    frequency: "4x por semana",
    restrictions: "Nenhuma",
    injuries: "Nenhuma",
    healthConditions: "Nenhuma",
    medications: "Nenhuma",
    observations: "Prefere treinos intensos, período manhã",
    emergencyContact: "Maria Santos (mãe) – (11) 98877-6655",
    workout: "Push/Pull/Legs",
    totalSessions: 12,
    evolution: [
      { date: "2026-01-10", weight: "84", bodyFat: "22%" },
      { date: "2026-04-03", weight: "80", bodyFat: "18%" },
    ],
    imageKey: "trainer1" as const,
  },
  s2: {
    name: "Ana Lima",
    age: 27,
    height: "162cm",
    weight: "65kg",
    goal: "Emagrecimento",
    level: "Iniciante",
    frequency: "3x por semana",
    restrictions: "Joelho direito frágil",
    injuries: "Entorse antiga no joelho",
    healthConditions: "Nenhuma",
    medications: "Nenhuma",
    observations: "Prefere horário noturno",
    emergencyContact: "José Lima (pai) – (11) 91234-5678",
    workout: "Full Body A/B",
    totalSessions: 8,
    evolution: [
      { date: "2026-02-05", weight: "70", bodyFat: "32%" },
      { date: "2026-04-05", weight: "65", bodyFat: "27%" },
    ],
    imageKey: "trainer2" as const,
  },
};

export default function PersonalStudentFileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const student = STUDENTS[studentId] ?? STUDENTS["s1"];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const sections = [
    {
      title: "Dados pessoais",
      icon: "user",
      fields: [
        { label: "Idade", value: `${student.age} anos` },
        { label: "Altura", value: student.height },
        { label: "Peso atual", value: student.weight },
        { label: "Objetivo", value: student.goal },
        { label: "Nível", value: student.level },
        { label: "Frequência", value: student.frequency },
      ],
    },
    {
      title: "Saúde",
      icon: "heart",
      fields: [
        { label: "Restrições", value: student.restrictions },
        { label: "Lesões", value: student.injuries },
        { label: "Condições de saúde", value: student.healthConditions },
        { label: "Medicações", value: student.medications },
        { label: "Observações", value: student.observations },
        { label: "Emergência", value: student.emergencyContact },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Ficha do aluno</Text>
        <TouchableOpacity
          style={[styles.editWorkoutBtn, { backgroundColor: "#10B981" }]}
          onPress={() => router.push(`/personal/workout-edit?studentId=${studentId}`)}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={14} color="#FFFFFF" />
          <Text style={styles.editWorkoutBtnText}>Treino</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: colors.darkSurface }]}>
          <TrainerImage imageKey={student.imageKey} style={styles.heroPhoto} />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{student.name}</Text>
            <View style={[styles.levelBadge, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
              <Text style={styles.levelText}>{student.level}</Text>
            </View>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{student.totalSessions}</Text>
                <Text style={styles.heroStatLabel}>sessões</Text>
              </View>
              <View style={styles.heroDot} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{student.goal}</Text>
              </View>
            </View>
          </View>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.accent }]}>
                <Feather name={section.icon as any} size={14} color={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
            </View>
            {section.fields.map((f) => (
              <View key={f.label} style={[styles.fieldRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                <Text style={[styles.fieldValue, { color: colors.foreground }]}>{f.value || "—"}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIcon, { backgroundColor: "#ECFDF5" }]}>
              <Feather name="activity" size={14} color="#10B981" />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Evolução</Text>
          </View>
          {student.evolution.map((e: any, i: number) => (
            <View key={i} style={[styles.evoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.evoDate, { color: colors.mutedForeground }]}>
                {new Date(e.date + "T00:00:00").toLocaleDateString("pt-BR")}
              </Text>
              <View style={styles.evoVals}>
                <Text style={[styles.evoVal, { color: colors.foreground }]}>{e.weight}kg</Text>
                <Text style={[styles.evoVal, { color: "#F59E0B" }]}>{e.bodyFat} gordura</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.accent }]}>
              <Feather name="file-text" size={14} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Treino ativo</Text>
          </View>
          <View style={styles.workoutPreview}>
            <Text style={[styles.workoutName, { color: colors.foreground }]}>{student.workout}</Text>
            <TouchableOpacity
              onPress={() => router.push(`/personal/workout-edit?studentId=${studentId}`)}
              style={[styles.editWorkoutSmall, { borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={13} color={colors.mutedForeground} />
              <Text style={[styles.editWorkoutSmallText, { color: colors.mutedForeground }]}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontFamily: "Inter_600SemiBold" },
  editWorkoutBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  editWorkoutBtnText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 16, gap: 14 },
  heroCard: { borderRadius: 18, padding: 20, flexDirection: "row", gap: 16, alignItems: "flex-end" },
  heroPhoto: { width: 80, height: 96, borderRadius: 14, resizeMode: "cover" },
  heroInfo: { flex: 1, gap: 8 },
  heroName: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  levelBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  levelText: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Inter_500Medium" },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  heroStatVal: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  heroStatLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Inter_400Regular" },
  heroDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(255,255,255,0.3)" },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E5E7EB" },
  sectionIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  fieldRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  fieldValue: { fontSize: 13, fontFamily: "Inter_500Medium", maxWidth: "55%", textAlign: "right" },
  evoRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  evoDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  evoVals: { flexDirection: "row", gap: 12 },
  evoVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  workoutPreview: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  workoutName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  editWorkoutSmall: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1,
  },
  editWorkoutSmallText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});

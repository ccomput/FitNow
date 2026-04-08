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
    totalSessions: 12,
    evolution: [
      { date: "2026-01-10", weight: "84", bodyFat: "22%" },
      { date: "2026-04-03", weight: "80", bodyFat: "18%" },
    ],
    imageKey: "trainer1" as const,
    activeWorkout: {
      name: "Hipertrofia – Push/Pull/Legs",
      focus: "Hipertrofia",
      division: "Push / Pull / Legs",
      updatedAt: "2026-04-07",
      origin: "personal_adjusted" as const,
      updatedBy: "Carlos Mendes",
      history: [
        { date: "2026-01-15", action: "Treino informado pelo aluno", by: "Você (aluno)", byType: "student" as const },
        { date: "2026-02-20", action: "Ajuste de carga e volume", by: "Carlos Mendes", byType: "personal" as const },
        { date: "2026-04-07", action: "Reestruturação com foco em hipertrofia", by: "Carlos Mendes", byType: "personal" as const },
      ],
    },
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
    totalSessions: 8,
    evolution: [
      { date: "2026-02-05", weight: "70", bodyFat: "32%" },
      { date: "2026-04-05", weight: "65", bodyFat: "27%" },
    ],
    imageKey: "trainer2" as const,
    activeWorkout: {
      name: "Full Body A/B",
      focus: "Emagrecimento",
      division: "A / B alternado",
      updatedAt: "2026-03-15",
      origin: "personal_created" as const,
      updatedBy: "Carlos Mendes",
      history: [
        { date: "2026-03-15", action: "Treino criado pelo personal", by: "Carlos Mendes", byType: "personal" as const },
      ],
    },
  },
};

const ORIGIN_LABELS = {
  student: "Informado pelo aluno",
  personal_created: "Criado por personal",
  personal_adjusted: "Ajustado por personal",
};

const ORIGIN_COLORS = {
  student: "#3B82F6",
  personal_created: "#10B981",
  personal_adjusted: "#F59E0B",
};

export default function PersonalStudentFileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const student = STUDENTS[studentId] ?? STUDENTS["s1"];
  const aw = student.activeWorkout;

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
        <View style={{ width: 40 }} />
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

        <View style={[styles.workoutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.accent }]}>
              <Feather name="file-text" size={14} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Treino ativo do aluno</Text>
            <View style={[styles.activeDot, { backgroundColor: "#10B981" }]} />
          </View>

          {aw ? (
            <>
              <View style={styles.workoutInfo}>
                <Text style={[styles.workoutName, { color: colors.foreground }]}>{aw.name}</Text>
                <Text style={[styles.workoutDivision, { color: colors.mutedForeground }]}>
                  {aw.division} · {aw.focus}
                </Text>
              </View>

              <View style={styles.workoutMetaRow}>
                <View style={[
                  styles.originBadge,
                  { backgroundColor: ORIGIN_COLORS[aw.origin as keyof typeof ORIGIN_COLORS] + "18" },
                ]}>
                  <Text style={[
                    styles.originBadgeText,
                    { color: ORIGIN_COLORS[aw.origin as keyof typeof ORIGIN_COLORS] },
                  ]}>
                    {ORIGIN_LABELS[aw.origin as keyof typeof ORIGIN_LABELS]}
                  </Text>
                </View>
                <Text style={[styles.updatedAt, { color: colors.mutedForeground }]}>
                  {new Date(aw.updatedAt + "T00:00:00").toLocaleDateString("pt-BR")} · {aw.updatedBy}
                </Text>
              </View>

              <View style={[styles.historyPreview, { backgroundColor: colors.secondary, borderRadius: 10 }]}>
                <Text style={[styles.historyPreviewTitle, { color: colors.mutedForeground }]}>Histórico</Text>
                {aw.history.slice(-2).map((h: any, i: number) => (
                  <View key={i} style={styles.historyItem}>
                    <View style={[styles.historyDot, { backgroundColor: h.byType === "personal" ? colors.primary : "#3B82F6" }]} />
                    <Text style={[styles.historyText, { color: colors.mutedForeground }]}>
                      {new Date(h.date + "T00:00:00").toLocaleDateString("pt-BR")} — {h.action}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.workoutActions}>
                <TouchableOpacity
                  style={[styles.workoutActionBtn, { borderColor: colors.border, flex: 1 }]}
                  onPress={() => router.push(`/personal/workout-edit?studentId=${studentId}`)}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={14} color={colors.foreground} />
                  <Text style={[styles.workoutActionBtnText, { color: colors.foreground }]}>Ajustar treino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.workoutActionBtnPrimary, { backgroundColor: "#10B981", flex: 1 }]}
                  onPress={() => router.push(`/personal/workout-edit?studentId=${studentId}`)}
                  activeOpacity={0.8}
                >
                  <Feather name="plus-circle" size={14} color="#FFFFFF" />
                  <Text style={styles.workoutActionBtnPrimaryText}>Criar novo</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.noWorkout}>
              <Text style={[styles.noWorkoutText, { color: colors.mutedForeground }]}>
                Aluno ainda não possui treino ativo na plataforma.
              </Text>
              <TouchableOpacity
                style={[styles.createWorkoutBtn, { backgroundColor: "#10B981" }]}
                onPress={() => router.push(`/personal/workout-edit?studentId=${studentId}`)}
                activeOpacity={0.85}
              >
                <Feather name="plus-circle" size={15} color="#FFFFFF" />
                <Text style={styles.createWorkoutBtnText}>Criar treino</Text>
              </TouchableOpacity>
            </View>
          )}
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
  sectionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
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
  workoutCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  activeDot: { width: 7, height: 7, borderRadius: 3.5 },
  workoutInfo: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, gap: 3 },
  workoutName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  workoutDivision: { fontSize: 12, fontFamily: "Inter_400Regular" },
  workoutMetaRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingBottom: 10, flexWrap: "wrap" },
  originBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  originBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  updatedAt: { fontSize: 11, fontFamily: "Inter_400Regular" },
  historyPreview: { marginHorizontal: 14, marginBottom: 12, padding: 12, gap: 8 },
  historyPreviewTitle: { fontSize: 10, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 },
  historyItem: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  historyDot: { width: 6, height: 6, borderRadius: 3, marginTop: 4 },
  historyText: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17 },
  workoutActions: { flexDirection: "row", gap: 10, padding: 14, paddingTop: 0 },
  workoutActionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  workoutActionBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  workoutActionBtnPrimary: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 10, borderRadius: 12 },
  workoutActionBtnPrimaryText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  noWorkout: { padding: 14, gap: 12, alignItems: "flex-start" },
  noWorkoutText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  createWorkoutBtn: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  createWorkoutBtnText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

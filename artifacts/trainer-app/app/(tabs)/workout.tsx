import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const ORIGIN_CONFIG = {
  student: { label: "Informado por você", icon: "user", color: "#3B82F6", bg: "#EFF6FF" },
  personal_created: { label: "Criado por personal", icon: "award", color: "#10B981", bg: "#ECFDF5" },
  personal_adjusted: { label: "Ajustado por personal", icon: "edit-2", color: "#F59E0B", bg: "#FFFBEB" },
};

const RECENT_TRAINERS = [
  { id: "t1", name: "Carlos Mendes", specialty: "Hipertrofia" },
  { id: "t2", name: "Fernanda Lima", specialty: "Funcional" },
];

export default function WorkoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { workout, setWorkout, studentProfile } = useApp();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<"adjust" | "new" | null>(null);
  const [requestGoal, setRequestGoal] = useState("");
  const [requestObs, setRequestObs] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const handleSendRequest = () => {
    setRequestSent(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSent(false);
      setRequestGoal("");
      setRequestObs("");
      setSelectedTrainer(null);
      setRequestType(null);
    }, 2000);
  };

  if (!workout) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 16 }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Meu treino</Text>
        </View>
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="file-text" size={36} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Nenhum treino ativo
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
            Seu treino fica centralizado aqui. Personais que você contratar conseguem visualizar e dar continuidade ao seu treino.
          </Text>
          <View style={styles.emptyActions}>
            <TouchableOpacity
              style={[styles.emptyBtnPrimary, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/workout/register")}
              activeOpacity={0.85}
            >
              <Feather name="plus-circle" size={16} color="#FFFFFF" />
              <Text style={styles.emptyBtnPrimaryText}>Informar meu treino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.emptyBtnSecondary, { borderColor: colors.border }]}
              onPress={() => router.push("/(tabs)/")}
              activeOpacity={0.8}
            >
              <Feather name="map" size={16} color={colors.foreground} />
              <Text style={[styles.emptyBtnSecondaryText, { color: colors.foreground }]}>Agendar com um personal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const originCfg = ORIGIN_CONFIG[workout.origin];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Meu treino</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Treino ativo · atualizado em {new Date(workout.updatedAt + "T00:00:00").toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.historyBtn, { borderColor: colors.border }]}
          onPress={() => router.push("/workout/history")}
          activeOpacity={0.7}
        >
          <Feather name="clock" size={16} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.workoutHero, { backgroundColor: colors.darkSurface }]}>
          <View style={styles.workoutHeroTop}>
            <View style={{ flex: 1 }}>
              <View style={[styles.activeBadge, { backgroundColor: "rgba(16,185,129,0.2)" }]}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBadgeText}>TREINO ATIVO</Text>
              </View>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDivision}>{workout.division}</Text>
            </View>
            <View style={[styles.focusBadge, { backgroundColor: "rgba(255,90,31,0.2)" }]}>
              <Text style={styles.focusBadgeText}>{workout.focus}</Text>
            </View>
          </View>

          <View style={styles.workoutMeta}>
            <View style={[styles.originPill, { backgroundColor: originCfg.bg }]}>
              <Feather name={originCfg.icon as any} size={11} color={originCfg.color} />
              <Text style={[styles.originPillText, { color: originCfg.color }]}>{originCfg.label}</Text>
            </View>
            <View style={styles.updatedByRow}>
              <Feather name="refresh-cw" size={11} color="rgba(255,255,255,0.4)" />
              <Text style={styles.updatedByText}>
                por {workout.updatedBy}
              </Text>
            </View>
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
              style={[styles.exerciseRow, { borderBottomColor: colors.border }]}
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
              <Feather name={expanded[i] ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {workout.observations ? (
          <View style={[styles.obsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.obsCardHeader}>
              <Feather name="file-text" size={15} color={colors.primary} />
              <Text style={[styles.obsCardTitle, { color: colors.foreground }]}>Observações</Text>
            </View>
            <Text style={[styles.obsCardText, { color: colors.mutedForeground }]}>{workout.observations}</Text>
          </View>
        ) : null}

        <View style={[styles.actionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.actionsTitle, { color: colors.foreground }]}>Ações</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              onPress={() => { setRequestType("adjust"); setShowRequestModal(true); }}
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={15} color={colors.foreground} />
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Pedir ajuste</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              onPress={() => { setRequestType("new"); setShowRequestModal(true); }}
              activeOpacity={0.7}
            >
              <Feather name="refresh-cw" size={15} color={colors.foreground} />
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Solicitar novo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkinBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/checkin/today")}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={18} color="#FFFFFF" />
          <Text style={styles.checkinBtnText}>Registrar treino de hoje</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showRequestModal} transparent animationType="slide" onRequestClose={() => setShowRequestModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            {requestSent ? (
              <View style={styles.requestSentWrap}>
                <View style={[styles.requestSentIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Feather name="check-circle" size={36} color="#10B981" />
                </View>
                <Text style={[styles.requestSentTitle, { color: colors.foreground }]}>Solicitação enviada!</Text>
                <Text style={[styles.requestSentSub, { color: colors.mutedForeground }]}>
                  Seu personal será notificado.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.modalHandle} />
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {requestType === "adjust" ? "Pedir ajuste no treino" : "Solicitar novo treino"}
                </Text>
                <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
                  {requestType === "adjust"
                    ? "Informe o que gostaria de ajustar no treino atual."
                    : "Informe o objetivo do novo treino."}
                </Text>

                <View style={styles.modalForm}>
                  <View style={styles.fieldBlock}>
                    <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Objetivo desejado</Text>
                    <TextInput
                      style={[styles.fieldInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                      value={requestGoal}
                      onChangeText={setRequestGoal}
                      placeholder="Ex: Focar mais em pernas e glúteos"
                      placeholderTextColor={colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.fieldBlock}>
                    <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Observações</Text>
                    <TextInput
                      style={[styles.fieldInputMulti, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                      value={requestObs}
                      onChangeText={setRequestObs}
                      placeholder="Alguma preferência ou restrição adicional?"
                      placeholderTextColor={colors.mutedForeground}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Selecionar personal</Text>
                    {RECENT_TRAINERS.map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        onPress={() => setSelectedTrainer(t.id)}
                        style={[
                          styles.trainerOption,
                          {
                            backgroundColor: selectedTrainer === t.id ? colors.accent : colors.background,
                            borderColor: selectedTrainer === t.id ? colors.primary : colors.border,
                          },
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.trainerOptionAvatar, { backgroundColor: colors.primary }]}>
                          <Text style={styles.trainerOptionAvatarText}>{t.name[0]}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.trainerOptionName, { color: colors.foreground }]}>{t.name}</Text>
                          <Text style={[styles.trainerOptionSpec, { color: colors.mutedForeground }]}>{t.specialty}</Text>
                        </View>
                        {selectedTrainer === t.id && <Feather name="check-circle" size={16} color={colors.primary} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                    onPress={() => setShowRequestModal(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modalCancelText, { color: colors.mutedForeground }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalSendBtn, { backgroundColor: colors.primary }]}
                    onPress={handleSendRequest}
                    activeOpacity={0.85}
                  >
                    <Feather name="send" size={15} color="#FFFFFF" />
                    <Text style={styles.modalSendText}>Enviar solicitação</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  historyBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 16, gap: 14 },
  workoutHero: { borderRadius: 18, padding: 20, gap: 14 },
  workoutHeroTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#10B981" },
  activeBadgeText: { color: "#10B981", fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  workoutName: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  workoutDivision: { color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 3 },
  focusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginTop: 30 },
  focusBadgeText: { color: "#FF5A1F", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  workoutMeta: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  originPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  originPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  updatedByRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  updatedByText: { color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Inter_400Regular" },
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
  actionsCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  actionsTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 11, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  checkinBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, borderRadius: 14,
  },
  checkinBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 32 },
  emptyIcon: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  emptyActions: { width: "100%", gap: 10, marginTop: 8 },
  emptyBtnPrimary: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  emptyBtnPrimaryText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  emptyBtnSecondary: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 14, borderWidth: 1 },
  emptyBtnSecondaryText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 4 },
  modalTitle: { fontSize: 19, fontFamily: "Inter_700Bold" },
  modalSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  modalForm: { gap: 14 },
  fieldBlock: { gap: 6 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  fieldInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, fontFamily: "Inter_400Regular" },
  fieldInputMulti: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 80, textAlignVertical: "top",
  },
  trainerOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 6 },
  trainerOptionAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  trainerOptionAvatarText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
  trainerOptionName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  trainerOptionSpec: { fontSize: 12, fontFamily: "Inter_400Regular" },
  modalActions: { flexDirection: "row", gap: 10, paddingTop: 4 },
  modalCancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  modalCancelText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  modalSendBtn: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 12 },
  modalSendText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  requestSentWrap: { alignItems: "center", gap: 12, paddingVertical: 24 },
  requestSentIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  requestSentTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  requestSentSub: { fontSize: 14, fontFamily: "Inter_400Regular" },
});

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

function getExerciseMeta(name: string) {
  const n = name.toLowerCase();
  if (n.includes("supino") || n.includes("peitoral") || n.includes("crucifixo") || n.includes("fly")) {
    return {
      muscle: "Peitoral", color: "#3B82F6", bg: "#EFF6FF", videoColor: "#0F2A5C",
      instructions: [
        "Deite no banco com os pés apoiados no chão e a coluna neutra",
        "Segure o peso na largura dos ombros, com cotovelos a 45°",
        "Desça controladamente até o peito e retorne sem travar os cotovelos",
      ],
      mistakes: [
        "Arquear excessivamente a lombar",
        "Soltar o ar no ponto de maior esforço",
        "Cotovelos muito abertos (acima de 90°)",
      ],
    };
  }
  if (n.includes("desenvolvimento") || n.includes("elevação") || n.includes("ombro")) {
    return {
      muscle: "Ombros", color: "#8B5CF6", bg: "#F5F3FF", videoColor: "#2D1B69",
      instructions: [
        "Sente-se ereto com os pés no chão, core contraído",
        "Leve os pesos à altura dos ombros, cotovelos flexionados a 90°",
        "Empurre para cima em arco natural, sem travar no topo",
      ],
      mistakes: [
        "Inclinar o tronco para trás durante o movimento",
        "Levantar os ombros em direção às orelhas",
        "Usar impulso corporal para elevar o peso",
      ],
    };
  }
  if (n.includes("tríceps") || n.includes("triceps") || n.includes("pulley") || n.includes("testa") || n.includes("francês")) {
    return {
      muscle: "Tríceps", color: "#EF4444", bg: "#FEF2F2", videoColor: "#5C0F0F",
      instructions: [
        "Fique em pé de frente ao cabo, core ativado e estável",
        "Cotovelos próximos ao corpo e estáticos durante todo o movimento",
        "Faça a extensão completa do cotovelo, controlando a volta",
      ],
      mistakes: [
        "Afastar os cotovelos do corpo durante a extensão",
        "Usar o peso do corpo para forçar a descida",
        "Não completar a amplitude total do movimento",
      ],
    };
  }
  if (n.includes("bíceps") || n.includes("biceps") || n.includes("rosca") || n.includes("curl")) {
    return {
      muscle: "Bíceps", color: "#F59E0B", bg: "#FFFBEB", videoColor: "#5C3A00",
      instructions: [
        "Fique ereto, cotovelos colados ao corpo",
        "Suba o peso contraindo o bíceps, sem balançar o tronco",
        "Desça de forma controlada, completando a amplitude",
      ],
      mistakes: [
        "Balançar o tronco para dar impulso ao peso",
        "Não completar a descida (perda de amplitude)",
        "Afastar os cotovelos do corpo no meio do movimento",
      ],
    };
  }
  if (n.includes("agacha") || n.includes("squat") || n.includes("leg") || n.includes("afundo") || n.includes("avanço") || n.includes("stiff") || n.includes("cadeira")) {
    return {
      muscle: "Pernas / Glúteos", color: "#10B981", bg: "#ECFDF5", videoColor: "#0A3325",
      instructions: [
        "Pés na largura dos ombros, pontas levemente para fora",
        "Desça controlando o joelho sobre a ponta do pé, coluna neutra",
        "Suba empurrando o chão, ativando glúteos e quadríceps",
      ],
      mistakes: [
        "Joelhos caindo para dentro (valgo do joelho)",
        "Inclinar o tronco excessivamente à frente",
        "Não atingir a amplitude completa do movimento",
      ],
    };
  }
  if (n.includes("puxada") || n.includes("remada") || n.includes("costas") || n.includes("lat")) {
    return {
      muscle: "Costas", color: "#6366F1", bg: "#EEF2FF", videoColor: "#1E1B4B",
      instructions: [
        "Sente-se estável com o core contraído, levemente inclinado para trás",
        "Puxe a barra em direção ao peitoral, não ao pescoço",
        "Retorne de forma controlada, sentindo o alongamento das costas",
      ],
      mistakes: [
        "Usar impulso do corpo (jogar o tronco para trás)",
        "Puxar com os braços sem ativar o grande dorsal",
        "Soltar o peso sem controlar a descida",
      ],
    };
  }
  return {
    muscle: "Core / Funcional", color: "#6B7280", bg: "#F3F4F6", videoColor: "#1F2937",
    instructions: [
      "Mantenha o corpo alinhado e o core contraído durante todo o movimento",
      "Respire de forma controlada — expire no esforço, inspire na volta",
      "Foque na qualidade da execução antes de aumentar a carga",
    ],
    mistakes: [
      "Perder a postura ou o alinhamento corporal",
      "Prender a respiração durante o esforço",
      "Sacrificar a forma para aumentar o peso ou velocidade",
    ],
  };
}

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
  const [selectedExDetail, setSelectedExDetail] = useState<number | null>(null);

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
              <Text style={styles.updatedByText}>por {workout.updatedBy}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Exercícios</Text>
            <View style={styles.sectionHeaderRight}>
              <View style={[styles.videoHintPill, { backgroundColor: colors.accent }]}>
                <Feather name="play-circle" size={11} color={colors.primary} />
                <Text style={[styles.videoHintText, { color: colors.primary }]}>ver execução</Text>
              </View>
              <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                {workout.exercises.length} ex.
              </Text>
            </View>
          </View>

          {workout.exercises.map((ex, i) => {
            const meta = getExerciseMeta(ex.name);
            return (
              <View
                key={i}
                style={[styles.exerciseRow, { borderBottomColor: colors.border }]}
              >
                <View style={[styles.exerciseNum, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.exerciseNumText, { color: colors.primary }]}>{i + 1}</Text>
                </View>

                <TouchableOpacity
                  style={styles.exerciseInfo}
                  onPress={() => toggle(i)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.exerciseName, { color: colors.foreground }]}>{ex.name}</Text>
                  <View style={styles.exerciseMetaRow}>
                    <View style={[styles.exMusclePill, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.exMuscleText, { color: meta.color }]}>{meta.muscle}</Text>
                    </View>
                    <Text style={[styles.exerciseSets, { color: colors.mutedForeground }]}>
                      {ex.sets} séries × {ex.reps} reps
                    </Text>
                  </View>
                  {expanded[i] && ex.obs && (
                    <View style={[styles.obsBox, { backgroundColor: colors.secondary }]}>
                      <Feather name="info" size={12} color={colors.mutedForeground} />
                      <Text style={[styles.obsText, { color: colors.mutedForeground }]}>{ex.obs}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.exerciseRightActions}>
                  <TouchableOpacity
                    onPress={() => setSelectedExDetail(i)}
                    style={[styles.videoBtn, { backgroundColor: colors.accent }]}
                    activeOpacity={0.7}
                  >
                    <Feather name="play-circle" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggle(i)} activeOpacity={0.7}>
                    <Feather
                      name={expanded[i] ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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

      {/* Exercise detail modal */}
      <Modal
        visible={selectedExDetail !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedExDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.exModalSheet, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            {selectedExDetail !== null && workout.exercises[selectedExDetail] && (() => {
              const ex = workout.exercises[selectedExDetail];
              const meta = getExerciseMeta(ex.name);
              return (
                <ScrollView showsVerticalScrollIndicator={false} style={styles.exModalScroll}>
                  <View style={styles.exModalHeader}>
                    <View style={[styles.exMusclePillLarge, { backgroundColor: meta.bg }]}>
                      <Feather name="zap" size={12} color={meta.color} />
                      <Text style={[styles.exMusclePillLargeText, { color: meta.color }]}>{meta.muscle}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setSelectedExDetail(null)}
                      style={[styles.exCloseX, { backgroundColor: colors.secondary }]}
                    >
                      <Feather name="x" size={16} color={colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.exModalTitle, { color: colors.foreground }]}>{ex.name}</Text>
                  <Text style={[styles.exModalSub, { color: colors.mutedForeground }]}>
                    {ex.sets} séries × {ex.reps} reps
                  </Text>

                  {/* Video placeholder */}
                  <View style={[styles.videoPlaceholder, { backgroundColor: meta.videoColor }]}>
                    <View style={styles.videoPlayCircle}>
                      <Feather name="play" size={30} color="#FFFFFF" />
                    </View>
                    <View style={styles.videoBottomRow}>
                      <Feather name="video" size={12} color="rgba(255,255,255,0.55)" />
                      <Text style={styles.videoBottomText}>Demonstração · FitNow</Text>
                    </View>
                    <View style={[styles.videoQualityBadge]}>
                      <Text style={styles.videoQualityText}>HD</Text>
                    </View>
                  </View>

                  {/* Instructions */}
                  <Text style={[styles.exSectionTitle, { color: colors.foreground }]}>Execução correta</Text>
                  {meta.instructions.map((step, idx) => (
                    <View key={idx} style={[styles.exInstRow, { backgroundColor: colors.secondary }]}>
                      <View style={[styles.exInstNum, { backgroundColor: meta.color + "20" }]}>
                        <Text style={[styles.exInstNumText, { color: meta.color }]}>{idx + 1}</Text>
                      </View>
                      <Text style={[styles.exInstText, { color: colors.foreground }]}>{step}</Text>
                    </View>
                  ))}

                  {/* Common mistakes */}
                  <Text style={[styles.exSectionTitle, { color: colors.foreground }]}>Erros comuns</Text>
                  {meta.mistakes.map((m, idx) => (
                    <View key={idx} style={styles.exMistakeRow}>
                      <View style={styles.exMistakeIcon}>
                        <Feather name="alert-circle" size={14} color="#EF4444" />
                      </View>
                      <Text style={[styles.exMistakeText, { color: colors.mutedForeground }]}>{m}</Text>
                    </View>
                  ))}

                  {/* Personal note */}
                  {ex.obs && (
                    <View style={[styles.exPersonalNote, { backgroundColor: "#FFF0EB", borderColor: "#FDBA74" }]}>
                      <Feather name="message-square" size={14} color="#FF5A1F" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exPersonalNoteLabel}>Observação do personal</Text>
                        <Text style={styles.exPersonalNoteText}>{ex.obs}</Text>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.exCloseBtn, { backgroundColor: colors.primary }]}
                    onPress={() => setSelectedExDetail(null)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.exCloseBtnText}>Fechar</Text>
                  </TouchableOpacity>
                  <View style={{ height: 24 }} />
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>

      {/* Request modal */}
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
  sectionHeaderRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  videoHintPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  videoHintText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  exerciseRow: {
    flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  exerciseNum: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 2 },
  exerciseNumText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  exerciseInfo: { flex: 1, gap: 4 },
  exerciseName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  exerciseMetaRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  exMusclePill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  exMuscleText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  exerciseSets: { fontSize: 11, fontFamily: "Inter_400Regular" },
  exerciseRightActions: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 3 },
  videoBtn: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  obsBox: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8, borderRadius: 8, marginTop: 4 },
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
  checkinBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
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

  // Modals shared
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 12 },

  // Exercise detail modal
  exModalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92%", paddingTop: 16 },
  exModalScroll: { paddingHorizontal: 20 },
  exModalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  exMusclePillLarge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  exMusclePillLargeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  exCloseX: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  exModalTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 4 },
  exModalSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 16 },
  videoPlaceholder: {
    height: 190, borderRadius: 16, alignItems: "center", justifyContent: "center",
    marginBottom: 20, overflow: "hidden", position: "relative",
  },
  videoPlayCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.3)",
  },
  videoBottomRow: {
    flexDirection: "row", alignItems: "center", gap: 6,
    position: "absolute", bottom: 12, left: 14,
  },
  videoBottomText: { color: "rgba(255,255,255,0.55)", fontSize: 11, fontFamily: "Inter_400Regular" },
  videoQualityBadge: {
    position: "absolute", top: 12, right: 12,
    backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  videoQualityText: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "Inter_700Bold" },
  exSectionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10, marginTop: 4 },
  exInstRow: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    padding: 12, borderRadius: 12, marginBottom: 8,
  },
  exInstNum: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  exInstNumText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  exInstText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  exMistakeRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  exMistakeIcon: { marginTop: 1 },
  exMistakeText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  exPersonalNote: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 8, marginBottom: 8,
  },
  exPersonalNoteLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#FF5A1F", marginBottom: 2 },
  exPersonalNoteText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#7C3A22", lineHeight: 20 },
  exCloseBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 16 },
  exCloseBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },

  // Request modal
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 },
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

import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  "Anamnese",
  "Saúde",
  "Avaliação Física",
  "Plano Inicial",
  "Treino Inicial",
];

export default function AssessmentConductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentName, studentId } = useLocalSearchParams<{ studentName?: string; studentId?: string }>();

  const name = studentName ?? "Victor Santos";

  const [step, setStep] = useState(0);

  // Step 0 — Anamnese
  const [objective, setObjective] = useState("Hipertrofia muscular");
  const [routine, setRoutine] = useState("Trabalho de escritório, sedentário");
  const [experience, setExperience] = useState("2 anos de musculação, parou há 6 meses");
  const [frequency, setFrequency] = useState("4x por semana");
  const [preferences, setPreferences] = useState("Treinos pela manhã, musculação");
  const [trainingHistory, setTrainingHistory] = useState("PPL 3x semana");

  // Step 1 — Saúde
  const [injuries, setInjuries] = useState("Nenhuma");
  const [pains, setPains] = useState("Leve dor no ombro direito");
  const [conditions, setConditions] = useState("Nenhuma");
  const [medications, setMedications] = useState("Nenhuma");
  const [healthObs, setHealthObs] = useState("");

  // Step 2 — Avaliação física
  const [weight, setWeight] = useState("80");
  const [height, setHeight] = useState("178");
  const [waist, setWaist] = useState("83");
  const [chest, setChest] = useState("103");
  const [arm, setArm] = useState("36");
  const [thigh, setThigh] = useState("56");
  const [bodyFat, setBodyFat] = useState("18");
  const [physObs, setPhysObs] = useState("Boa postura, quadríceps desenvolvido");

  // Step 3 — Plano inicial
  const [mainGoal, setMainGoal] = useState("Ganho de massa muscular");
  const [suggestedFreq, setSuggestedFreq] = useState("4x por semana");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("4");
  const [planObs, setPlanObs] = useState("Progredir carga a cada 2 semanas");

  // Step 4 — Treino
  const [workoutName, setWorkoutName] = useState("Hipertrofia – Push/Pull/Legs");
  const [division, setDivision] = useState("Push / Pull / Legs");
  const [exercises, setExercises] = useState(
    "Supino Reto; Supino Inclinado; Crucifixo\nRemada Curvada; Puxada Frontal; Rosca Direta\nAgachamento; Leg Press; Cadeira Extensora"
  );
  const [workoutObs, setWorkoutObs] = useState("Descanso de 90s. Aumentar carga a cada 2 semanas.");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace(`/assessment/complete?studentName=${encodeURIComponent(name)}`);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
            Avaliação de {name}
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Etapa {step + 1} de {STEPS.length} · {STEPS[step]}
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSeg,
              { backgroundColor: i <= step ? colors.primary : colors.muted },
            ]}
          />
        ))}
      </View>

      <View style={[styles.studentStrip, { backgroundColor: colors.darkSurface }]}>
        <View style={[styles.studentAvatar, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
          <Text style={styles.studentAvatarText}>{name[0]}</Text>
        </View>
        <Text style={styles.studentName}>{name}</Text>
        <View style={[styles.sessionTypeBadge, { backgroundColor: "rgba(255,90,31,0.2)" }]}>
          <Text style={styles.sessionTypeBadgeText}>Avaliação + Aula Inicial</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <View style={styles.stepContent}>
            <StepTitle title="Anamnese" desc="Histórico e contexto do aluno" colors={colors} />
            <Field label="Objetivo principal" value={objective} onChangeText={setObjective} colors={colors} />
            <Field label="Rotina / estilo de vida" value={routine} onChangeText={setRoutine} colors={colors} multiline />
            <Field label="Experiência anterior" value={experience} onChangeText={setExperience} colors={colors} multiline />
            <Field label="Frequência disponível" value={frequency} onChangeText={setFrequency} colors={colors} />
            <Field label="Preferências de treino" value={preferences} onChangeText={setPreferences} colors={colors} multiline />
            <Field label="Histórico de treino recente" value={trainingHistory} onChangeText={setTrainingHistory} colors={colors} multiline />
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <StepTitle title="Saúde e Restrições" desc="Informações de saúde relevantes" colors={colors} />
            <Field label="Lesões" value={injuries} onChangeText={setInjuries} colors={colors} />
            <Field label="Dores ou desconfortos" value={pains} onChangeText={setPains} colors={colors} multiline />
            <Field label="Condições de saúde" value={conditions} onChangeText={setConditions} colors={colors} />
            <Field label="Medicações em uso" value={medications} onChangeText={setMedications} colors={colors} />
            <Field label="Observações gerais" value={healthObs} onChangeText={setHealthObs} colors={colors} multiline placeholder="Outras informações relevantes..." />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <StepTitle title="Avaliação Física" desc="Medidas e composição corporal" colors={colors} />
            <View style={styles.measureGrid}>
              <View style={{ flex: 1 }}>
                <Field label="Peso (kg)" value={weight} onChangeText={setWeight} colors={colors} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Altura (cm)" value={height} onChangeText={setHeight} colors={colors} keyboardType="numeric" />
              </View>
            </View>
            <Text style={[styles.measureGroupLabel, { color: colors.mutedForeground }]}>Medidas (cm)</Text>
            <View style={styles.measureGrid}>
              <View style={{ flex: 1 }}>
                <Field label="Cintura" value={waist} onChangeText={setWaist} colors={colors} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Tórax" value={chest} onChangeText={setChest} colors={colors} keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.measureGrid}>
              <View style={{ flex: 1 }}>
                <Field label="Braço" value={arm} onChangeText={setArm} colors={colors} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Coxa" value={thigh} onChangeText={setThigh} colors={colors} keyboardType="numeric" />
              </View>
            </View>
            <Field label="% Gordura corporal (estimado)" value={bodyFat} onChangeText={setBodyFat} colors={colors} keyboardType="numeric" />
            <Field label="Observações físicas" value={physObs} onChangeText={setPhysObs} colors={colors} multiline />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <StepTitle title="Plano Inicial" desc="Recomendações para o acompanhamento" colors={colors} />
            <Field label="Objetivo principal definido" value={mainGoal} onChangeText={setMainGoal} colors={colors} />
            <Field label="Frequência sugerida" value={suggestedFreq} onChangeText={setSuggestedFreq} colors={colors} />
            <Field label="Sessões por semana" value={sessionsPerWeek} onChangeText={setSessionsPerWeek} colors={colors} keyboardType="numeric" />
            <Field label="Observações e estratégia" value={planObs} onChangeText={setPlanObs} colors={colors} multiline />

            <View style={[styles.infoBox, { backgroundColor: colors.secondary }]}>
              <Feather name="info" size={14} color={colors.mutedForeground} />
              <Text style={[styles.infoBoxText, { color: colors.mutedForeground }]}>
                A reavaliação será sugerida automaticamente em 90 dias.
              </Text>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <StepTitle title="Treino Inicial" desc="Monte o treino personalizado do aluno" colors={colors} />
            <Field label="Nome do treino" value={workoutName} onChangeText={setWorkoutName} colors={colors} />
            <Field label="Divisão" value={division} onChangeText={setDivision} colors={colors} placeholder="Ex: Push/Pull/Legs, A/B, Full Body" />
            <Field label="Exercícios (um por linha ou separados por ;)" value={exercises} onChangeText={setExercises} colors={colors} multiline rows={6} placeholder="Liste os exercícios de cada treino..." />
            <Field label="Observações para o aluno" value={workoutObs} onChangeText={setWorkoutObs} colors={colors} multiline />

            <View style={[styles.successPreview, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
              <Feather name="check-circle" size={16} color="#10B981" />
              <Text style={[styles.successPreviewText, { color: "#065F46" }]}>
                Ao salvar, o treino será definido como treino ativo do aluno com origem "Criado por personal".
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: step === STEPS.length - 1 ? "#10B981" : colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step === STEPS.length - 1 ? "Concluir avaliação" : "Próxima etapa"}
          </Text>
          <Feather name={step === STEPS.length - 1 ? "check" : "arrow-right"} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepTitle({ title, desc, colors }: { title: string; desc: string; colors: any }) {
  return (
    <View style={{ gap: 4, marginBottom: 4 }}>
      <Text style={[stl.stepTitleText, { color: colors.foreground }]}>{title}</Text>
      <Text style={[stl.stepDescText, { color: colors.mutedForeground }]}>{desc}</Text>
    </View>
  );
}

function Field({ label, value, onChangeText, keyboardType, placeholder, colors, multiline, rows }: any) {
  return (
    <View style={stl.fieldBlock}>
      <Text style={[stl.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[
          stl.fieldInput,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
          multiline && { minHeight: (rows ?? 3) * 24, textAlignVertical: "top", paddingTop: 10 },
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        placeholder={placeholder ?? label}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
      />
    </View>
  );
}

const stl = StyleSheet.create({
  stepTitleText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  stepDescText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  fieldBlock: { gap: 5 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  fieldInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, fontFamily: "Inter_400Regular" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  headerSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  progressRow: { flexDirection: "row", gap: 4, paddingHorizontal: 20, marginBottom: 0 },
  progressSeg: { flex: 1, height: 3, borderRadius: 2 },
  studentStrip: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingVertical: 12, marginTop: 0 },
  studentAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  studentAvatarText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_700Bold" },
  studentName: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  sessionTypeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  sessionTypeBadgeText: { color: "#FF5A1F", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 16 },
  stepContent: { gap: 14, paddingTop: 16 },
  measureGrid: { flexDirection: "row", gap: 12 },
  measureGroupLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: -4 },
  infoBox: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 12, alignItems: "flex-start" },
  infoBoxText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  successPreview: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 12, alignItems: "flex-start", borderWidth: 1 },
  successPreviewText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  nextBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

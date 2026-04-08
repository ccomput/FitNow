import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function OnboardingHealth() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentProfile, setStudentProfile } = useApp();

  const [restrictions, setRestrictions] = useState(studentProfile.restrictions);
  const [injuries, setInjuries] = useState(studentProfile.injuries);
  const [healthConditions, setHealthConditions] = useState(studentProfile.healthConditions);
  const [medications, setMedications] = useState(studentProfile.medications);
  const [observations, setObservations] = useState(studentProfile.observations);
  const [emergencyContact, setEmergencyContact] = useState(studentProfile.emergencyContact);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = () => {
    setStudentProfile({
      ...studentProfile,
      restrictions, injuries, healthConditions, medications, observations,
      emergencyContact,
    });
    router.push("/onboarding/workout");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={[styles.progressSeg, { backgroundColor: i <= 5 ? colors.primary : colors.muted }]} />
          ))}
        </View>
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>5 / 6</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Saúde</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Informações confidenciais compartilhadas apenas com seu personal
        </Text>

        <View style={[styles.privacyBanner, { backgroundColor: colors.secondary }]}>
          <Feather name="lock" size={14} color={colors.mutedForeground} />
          <Text style={[styles.privacyText, { color: colors.mutedForeground }]}>
            Dados de saúde são privados e protegidos
          </Text>
        </View>

        <View style={styles.form}>
          <MultiField label="Restrições físicas" value={restrictions} onChangeText={setRestrictions} placeholder='Ex: "Não posso agachar fundo"' colors={colors} />
          <MultiField label="Lesões" value={injuries} onChangeText={setInjuries} placeholder='Ex: "Tendinite no joelho direito"' colors={colors} />
          <MultiField label="Condições de saúde" value={healthConditions} onChangeText={setHealthConditions} placeholder='Ex: "Hipertensão controlada"' colors={colors} />
          <MultiField label="Medicações relevantes" value={medications} onChangeText={setMedications} placeholder='Ex: "Losartana 50mg"' colors={colors} />
          <MultiField label="Observações gerais" value={observations} onChangeText={setObservations} placeholder='Ex: "Prefiro treinos de manhã"' colors={colors} />

          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Contato de emergência</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="Nome e telefone"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>Próximo</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MultiField({ label, value, onChangeText, placeholder, colors }: any) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[styles.multiInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline
        numberOfLines={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  progressBar: { flex: 1, flexDirection: "row", gap: 4 },
  progressSeg: { flex: 1, height: 3, borderRadius: 2 },
  stepLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  scroll: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  privacyBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10 },
  privacyText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  form: { gap: 14 },
  fieldBlock: { gap: 6 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "Inter_400Regular" },
  multiInput: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 70, textAlignVertical: "top",
  },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  nextBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

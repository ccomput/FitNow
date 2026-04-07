import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const FEELINGS = [
  { id: "1", icon: "frown", label: "Muito difícil", color: "#EF4444" },
  { id: "2", icon: "meh", label: "Difícil", color: "#F59E0B" },
  { id: "3", icon: "smile", label: "Moderado", color: "#3B82F6" },
  { id: "4", icon: "thumbs-up", label: "Ótimo", color: "#10B981" },
  { id: "5", icon: "zap", label: "Incrível!", color: "#FF5A1F" },
];

export default function CheckinScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { workout } = useApp();

  const [feeling, setFeeling] = useState<string | null>(null);
  const [obs, setObs] = useState("");
  const [done, setDone] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSubmit = () => {
    setDone(true);
    setTimeout(() => router.back(), 2200);
  };

  if (done) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.successScreen}>
          <View style={[styles.successCircle, { backgroundColor: colors.primary }]}>
            <Feather name="check" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Treino registrado!</Text>
          <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
            Continue assim. Consistência é o segredo!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Check-in do treino</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}>
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.infoIcon, { backgroundColor: colors.accent }]}>
            <Feather name="activity" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>{workout?.name ?? "Treino de hoje"}</Text>
            <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Como foi o treino?</Text>
          <View style={styles.feelingsRow}>
            {FEELINGS.map((f) => {
              const isSelected = feeling === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setFeeling(f.id)}
                  style={[
                    styles.feelingBtn,
                    {
                      backgroundColor: isSelected ? f.color + "20" : colors.card,
                      borderColor: isSelected ? f.color : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Feather name={f.icon as any} size={24} color={isSelected ? f.color : colors.mutedForeground} />
                  <Text style={[styles.feelingLabel, { color: isSelected ? f.color : colors.mutedForeground }]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Observações</Text>
          <TextInput
            style={[styles.obsInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            value={obs}
            onChangeText={setObs}
            placeholder="Como foi o treino? Alguma dificuldade ou conquista?"
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Exercícios concluídos</Text>
          <View style={[styles.exerciseList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {(workout?.exercises ?? []).map((ex, i) => (
              <View key={i} style={[styles.exerciseCheckRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.checkBox, { backgroundColor: colors.success }]}>
                  <Feather name="check" size={12} color="#FFFFFF" />
                </View>
                <Text style={[styles.exerciseCheckName, { color: colors.foreground }]}>{ex.name}</Text>
                <Text style={[styles.exerciseCheckSets, { color: colors.mutedForeground }]}>
                  {ex.sets}×{ex.reps}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: feeling ? colors.primary : colors.muted }]}
          onPress={handleSubmit}
          disabled={!feeling}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={18} color={feeling ? "#FFFFFF" : colors.mutedForeground} />
          <Text style={[styles.submitBtnText, { color: feeling ? "#FFFFFF" : colors.mutedForeground }]}>
            Marcar como realizado
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 16, gap: 24 },
  infoCard: { flexDirection: "row", gap: 14, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: "center" },
  infoIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  infoTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  infoSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  feelingsRow: { flexDirection: "row", gap: 8 },
  feelingBtn: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, gap: 4 },
  feelingLabel: { fontSize: 9, fontFamily: "Inter_500Medium", textAlign: "center" },
  obsInput: {
    borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 14,
    fontFamily: "Inter_400Regular", minHeight: 100, textAlignVertical: "top",
  },
  exerciseList: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  exerciseCheckRow: {
    flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkBox: { width: 22, height: 22, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  exerciseCheckName: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  exerciseCheckSets: { fontSize: 12, fontFamily: "Inter_500Medium" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  submitBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  successScreen: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  successCircle: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  successSub: { fontSize: 14, fontFamily: "Inter_400Regular" },
});

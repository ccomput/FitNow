import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export default function AssessmentCompleteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentName } = useLocalSearchParams<{ studentName?: string }>();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const name = studentName ?? "Victor Santos";
  const today = new Date().toLocaleDateString("pt-BR");
  const reavDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: topPad + 24, paddingBottom: bottomPad + 100 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.successHeader}>
          <View style={[styles.successIcon, { backgroundColor: "#ECFDF5" }]}>
            <Feather name="check-circle" size={48} color="#10B981" />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Avaliação concluída!</Text>
          <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
            A ficha de {name} foi atualizada com todas as informações registradas hoje.
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.darkSurface }]}>
          <View style={styles.summaryRow}>
            <Feather name="user" size={15} color="rgba(255,255,255,0.5)" />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Aluno avaliado</Text>
              <Text style={styles.summaryValue}>{name}</Text>
            </View>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
          <View style={styles.summaryRow}>
            <Feather name="target" size={15} color="rgba(255,255,255,0.5)" />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Objetivo principal</Text>
              <Text style={styles.summaryValue}>Hipertrofia muscular</Text>
            </View>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
          <View style={styles.summaryRow}>
            <Feather name="calendar" size={15} color="rgba(255,255,255,0.5)" />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Frequência recomendada</Text>
              <Text style={styles.summaryValue}>4x por semana</Text>
            </View>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
          <View style={styles.summaryRow}>
            <Feather name="file-text" size={15} color="rgba(255,255,255,0.5)" />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Treino inicial criado</Text>
              <Text style={styles.summaryValue}>Hipertrofia – Push/Pull/Legs</Text>
            </View>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoCardHeader}>
            <View style={[styles.infoCardIcon, { backgroundColor: "#FFFBEB" }]}>
              <Feather name="refresh-cw" size={16} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoCardTitle, { color: colors.foreground }]}>Próxima reavaliação</Text>
              <Text style={[styles.infoCardSub, { color: colors.mutedForeground }]}>Data sugerida: {reavDate}</Text>
            </View>
          </View>
          <Text style={[styles.infoCardDesc, { color: colors.mutedForeground }]}>
            O app enviará uma notificação ao aluno quando a reavaliação estiver próxima. Isso garante continuidade e ajustes no treino ao longo do tempo.
          </Text>
        </View>

        <View style={[styles.checklistCard, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.checklistTitle, { color: colors.foreground }]}>O que foi concluído hoje</Text>
          {[
            "Anamnese completa registrada",
            "Avaliação física realizada",
            "Treino inicial criado e salvo",
            "Frequência recomendada definida",
            "Ficha do aluno atualizada",
          ].map((item, i) => (
            <View key={i} style={styles.checklistItem}>
              <Feather name="check-circle" size={14} color="#10B981" />
              <Text style={[styles.checklistText, { color: colors.foreground }]}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.dateNote, { color: colors.mutedForeground }]}>
          Avaliação realizada em {today}
        </Text>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.doneBtn, { backgroundColor: "#10B981" }]}
          onPress={() => router.push("/(personal-tabs)/")}
          activeOpacity={0.85}
        >
          <Feather name="check" size={18} color="#FFFFFF" />
          <Text style={styles.doneBtnText}>Finalizar atendimento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, gap: 20 },
  successHeader: { alignItems: "center", gap: 12, paddingBottom: 8 },
  successIcon: { width: 96, height: 96, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  successSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  summaryCard: { borderRadius: 18, padding: 20, gap: 0 },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  summaryInfo: { flex: 1, gap: 2 },
  summaryLabel: { color: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "Inter_400Regular" },
  summaryValue: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  summaryDivider: { height: StyleSheet.hairlineWidth },
  infoCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  infoCardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoCardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  infoCardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  infoCardSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  infoCardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  checklistCard: { borderRadius: 16, padding: 16, gap: 10 },
  checklistTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  checklistItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  checklistText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  dateNote: { textAlign: "center", fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  doneBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  doneBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

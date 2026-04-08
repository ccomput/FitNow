import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const TYPE_CONFIG = {
  student: { icon: "user", color: "#3B82F6", bg: "#EFF6FF" },
  personal: { icon: "award", color: "#FF5A1F", bg: "#FFF0EB" },
};

export default function WorkoutHistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { workout } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const history = workout?.history ?? [];
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Histórico do treino</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {workout?.name}
          </Text>
        </View>
      </View>

      <View style={[styles.continuityBanner, { backgroundColor: colors.accent }]}>
        <Feather name="link" size={14} color={colors.primary} />
        <Text style={[styles.continuityText, { color: colors.primary }]}>
          Seu treino é centralizado no FitNow. Qualquer personal contratado pode visualizar e dar continuidade.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timeline}>
          {sorted.map((entry, i) => {
            const cfg = TYPE_CONFIG[entry.byType];
            const isLast = i === sorted.length - 1;
            return (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
                    <Feather name={cfg.icon as any} size={13} color={cfg.color} />
                  </View>
                  {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                </View>
                <View style={[styles.timelineCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.timelineCardTop}>
                    <Text style={[styles.timelineDate, { color: colors.mutedForeground }]}>
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </Text>
                    {i === 0 && (
                      <View style={[styles.currentBadge, { backgroundColor: "#ECFDF5" }]}>
                        <Text style={styles.currentBadgeText}>Versão atual</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.timelineAction, { color: colors.foreground }]}>{entry.action}</Text>
                  <View style={styles.timelineBy}>
                    <View style={[styles.timelineByIcon, { backgroundColor: cfg.bg }]}>
                      <Feather name={cfg.icon as any} size={10} color={cfg.color} />
                    </View>
                    <Text style={[styles.timelineByText, { color: colors.mutedForeground }]}>
                      {entry.byType === "personal" ? "Personal: " : ""}{entry.by}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.secondary }]}>
          <Feather name="info" size={15} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Este histórico mostra todas as versões e ajustes do seu treino ao longo do tempo. Se você contratar um novo personal, ele verá esse histórico e poderá dar continuidade ao seu acompanhamento.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  continuityBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 16, borderRadius: 12, marginBottom: 12 },
  continuityText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  scroll: { paddingHorizontal: 16, gap: 12 },
  timeline: { gap: 0 },
  timelineItem: { flexDirection: "row", gap: 14 },
  timelineLeft: { alignItems: "center", width: 36 },
  timelineDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  timelineLine: { width: 2, flex: 1, marginTop: 4, marginBottom: 4 },
  timelineCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, gap: 8, marginBottom: 8 },
  timelineCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  timelineDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  currentBadgeText: { color: "#059669", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  timelineAction: { fontSize: 14, fontFamily: "Inter_500Medium" },
  timelineBy: { flexDirection: "row", alignItems: "center", gap: 6 },
  timelineByIcon: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  timelineByText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  infoCard: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});

import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function EvolutionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { evolution } = useApp();
  const [activeMetric, setActiveMetric] = useState<"weight" | "bodyFat" | "leanMass">("weight");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const latest = evolution[evolution.length - 1];
  const first = evolution[0];

  const getChange = (key: keyof typeof latest) => {
    const diff = Number(latest[key]) - Number(first[key]);
    return diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
  };

  const METRICS = [
    { id: "weight" as const, label: "Peso", unit: "kg", icon: "disc", color: "#FF5A1F" },
    { id: "bodyFat" as const, label: "Gordura", unit: "%", icon: "percent", color: "#F59E0B" },
    { id: "leanMass" as const, label: "Massa Magra", unit: "kg", icon: "trending-up", color: "#10B981" },
  ];

  const sorted = [...evolution].sort((a, b) => a.date.localeCompare(b.date));

  const chartValues = sorted.map((e) => Number(e[activeMetric]));
  const minVal = Math.min(...chartValues);
  const maxVal = Math.max(...chartValues);
  const range = maxVal - minVal || 1;
  const chartH = 140;

  const MEASURES = [
    { label: "Cintura", key: "waist", unit: "cm" },
    { label: "Peitoral", key: "chest", unit: "cm" },
    { label: "Braço", key: "arm", unit: "cm" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Minha evolução</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
          <Feather name="plus" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          {METRICS.map((m) => {
            const val = Number(latest[m.id]);
            const change = getChange(m.id);
            const isNegGood = m.id === "bodyFat" || m.id === "weight";
            const isGood = isNegGood ? Number(change) <= 0 : Number(change) >= 0;

            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: activeMetric === m.id ? colors.card : colors.background,
                    borderColor: activeMetric === m.id ? m.color : colors.border,
                    borderWidth: activeMetric === m.id ? 1.5 : 1,
                  },
                ]}
                onPress={() => setActiveMetric(m.id)}
                activeOpacity={0.7}
              >
                <Feather name={m.icon as any} size={14} color={m.color} />
                <Text style={[styles.statVal, { color: colors.foreground }]}>
                  {val.toFixed(1)}
                  <Text style={[styles.statUnit, { color: colors.mutedForeground }]}>{m.unit}</Text>
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{m.label}</Text>
                <Text style={[styles.statChange, { color: isGood ? colors.success : "#EF4444" }]}>
                  {change}{m.unit}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.foreground }]}>
              {METRICS.find((m) => m.id === activeMetric)?.label} ao longo do tempo
            </Text>
          </View>

          <View style={[styles.chart, { height: chartH }]}>
            {sorted.map((entry, i) => {
              const val = Number(entry[activeMetric]);
              const barH = ((val - minVal) / range) * (chartH - 20) + 10;
              const pct = ((val - minVal) / range) * 100;
              const metric = METRICS.find((m) => m.id === activeMetric)!;
              return (
                <View key={i} style={styles.chartBar}>
                  <Text style={[styles.chartBarVal, { color: colors.mutedForeground }]}>
                    {val.toFixed(1)}
                  </Text>
                  <View style={[styles.chartBarFill, { height: barH, backgroundColor: metric.color, opacity: 0.8 }]} />
                  <Text style={[styles.chartBarDate, { color: colors.mutedForeground }]}>
                    {entry.date.slice(5).replace("-", "/")}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Medidas corporais</Text>
          {MEASURES.map((m) => {
            const oldVal = (first as any)[m.key];
            const newVal = (latest as any)[m.key];
            const diff = newVal - oldVal;
            return (
              <View key={m.key} style={[styles.measureRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.measureLabel, { color: colors.mutedForeground }]}>{m.label}</Text>
                <View style={styles.measureVals}>
                  <Text style={[styles.measureOld, { color: colors.mutedForeground }]}>
                    {oldVal}{m.unit}
                  </Text>
                  <Feather name="arrow-right" size={12} color={colors.muted} />
                  <Text style={[styles.measureNew, { color: colors.foreground }]}>
                    {newVal}{m.unit}
                  </Text>
                  <Text style={[
                    styles.measureDiff,
                    { color: diff <= 0 ? colors.success : "#EF4444" },
                  ]}>
                    ({diff > 0 ? "+" : ""}{diff}{m.unit})
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Histórico completo</Text>
          {[...evolution].reverse().map((entry, i) => (
            <View key={i} style={[styles.historyRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.historyDate, { color: colors.foreground }]}>
                  {new Date(entry.date + "T00:00:00").toLocaleDateString("pt-BR")}
                </Text>
              </View>
              <View style={styles.historyVals}>
                <Text style={[styles.historyVal, { color: colors.foreground }]}>{entry.weight}kg</Text>
                <Text style={[styles.historyVal, { color: "#F59E0B" }]}>{entry.bodyFat}%</Text>
                <Text style={[styles.historyVal, { color: "#10B981" }]}>{entry.leanMass}kg</Text>
              </View>
            </View>
          ))}
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
  addBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 16, gap: 16 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, gap: 4, alignItems: "center" },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statUnit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  statChange: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  chartCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  chartHeader: {},
  chartTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 12, paddingTop: 8 },
  chartBar: { flex: 1, alignItems: "center", gap: 4 },
  chartBarVal: { fontSize: 9, fontFamily: "Inter_500Medium" },
  chartBarFill: { width: "100%", borderRadius: 4 },
  chartBarDate: { fontSize: 9, fontFamily: "Inter_400Regular" },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  measureRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  measureLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  measureVals: { flexDirection: "row", alignItems: "center", gap: 6 },
  measureOld: { fontSize: 13, fontFamily: "Inter_400Regular" },
  measureNew: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  measureDiff: { fontSize: 11, fontFamily: "Inter_500Medium" },
  historyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  historyDate: { fontSize: 13, fontFamily: "Inter_500Medium" },
  historyVals: { flexDirection: "row", gap: 12 },
  historyVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

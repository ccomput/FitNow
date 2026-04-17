import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const PROGRESS_PHOTOS = [
  {
    id: "p1",
    date: "2025-10-15",
    phase: "Início",
    weight: 87.5,
    bodyFat: 24.5,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    trainerNote: "Primeiro registro. Aluno chegou sedentário com dores lombares. Boa disposição e comprometimento desde o início!",
  },
  {
    id: "p2",
    date: "2025-12-20",
    phase: "3 meses",
    weight: 84.2,
    bodyFat: 22.1,
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    trainerNote: "Evolução visível! Postura claramente melhorada, dores lombares eliminadas. Aumentamos a carga nos principais exercícios.",
  },
  {
    id: "p3",
    date: "2026-02-15",
    phase: "5 meses",
    weight: 82.0,
    bodyFat: 20.8,
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    trainerNote: "Definição muscular começando a aparecer. Treino de alta intensidade introduzido com sucesso. Aluno superou expectativas!",
  },
  {
    id: "p4",
    date: "2026-04-10",
    phase: "Atual",
    weight: 80.3,
    bodyFat: 19.2,
    color: "#10B981",
    bgColor: "#ECFDF5",
    trainerNote: "Resultado incrível em 6 meses! Definição clara, volume muscular evidente e muito mais energia no dia a dia.",
  },
];

export default function EvolutionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { evolution } = useApp();
  const [activeMetric, setActiveMetric] = useState<"weight" | "bodyFat" | "leanMass">("weight");
  const [activeView, setActiveView] = useState<"metrics" | "photos">("metrics");
  const [compareMode, setCompareMode] = useState(false);

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

  const firstPhoto = PROGRESS_PHOTOS[0];
  const latestPhoto = PROGRESS_PHOTOS[PROGRESS_PHOTOS.length - 1];

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

      {/* Tab bar */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeView === "metrics" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveView("metrics")}
          activeOpacity={0.7}
        >
          <Feather name="trending-up" size={15} color={activeView === "metrics" ? colors.primary : colors.mutedForeground} />
          <Text style={[styles.tabLabel, { color: activeView === "metrics" ? colors.primary : colors.mutedForeground }]}>
            Métricas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeView === "photos" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveView("photos")}
          activeOpacity={0.7}
        >
          <Feather name="camera" size={15} color={activeView === "photos" ? colors.primary : colors.mutedForeground} />
          <Text style={[styles.tabLabel, { color: activeView === "photos" ? colors.primary : colors.mutedForeground }]}>
            Fotos
          </Text>
          <View style={[styles.tabBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.tabBadgeText}>{PROGRESS_PHOTOS.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>

        {activeView === "metrics" ? (
          <>
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
          </>
        ) : (
          <>
            {/* Comparison banner */}
            <TouchableOpacity
              style={[styles.compareBtn, { backgroundColor: compareMode ? colors.primary : colors.card, borderColor: compareMode ? colors.primary : colors.border }]}
              onPress={() => setCompareMode(!compareMode)}
              activeOpacity={0.8}
            >
              <Feather name="columns" size={16} color={compareMode ? "#FFFFFF" : colors.foreground} />
              <Text style={[styles.compareBtnText, { color: compareMode ? "#FFFFFF" : colors.foreground }]}>
                {compareMode ? "Comparativo ativo" : "Ver antes e depois"}
              </Text>
              {compareMode && <Feather name="check" size={14} color="#FFFFFF" />}
            </TouchableOpacity>

            {/* Before / After comparison */}
            {compareMode && (
              <View style={[styles.beforeAfterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.beforeAfterTitle, { color: colors.foreground }]}>Comparativo: início vs atual</Text>

                <View style={styles.beforeAfterRow}>
                  {/* Before */}
                  <View style={styles.beforeAfterItem}>
                    <View style={[styles.photoFrameLarge, { backgroundColor: firstPhoto.color + "22", borderColor: firstPhoto.color + "44" }]}>
                      <Feather name="user" size={40} color={firstPhoto.color} />
                      <View style={[styles.photoDateTag, { backgroundColor: firstPhoto.color }]}>
                        <Text style={styles.photoDateTagText}>
                          {new Date(firstPhoto.date + "T00:00:00").toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.beforeAfterPhase, { color: firstPhoto.color }]}>{firstPhoto.phase}</Text>
                    <Text style={[styles.beforeAfterWeight, { color: colors.foreground }]}>{firstPhoto.weight} kg</Text>
                    <Text style={[styles.beforeAfterFat, { color: colors.mutedForeground }]}>{firstPhoto.bodyFat}% gordura</Text>
                  </View>

                  {/* Arrow */}
                  <View style={styles.compareArrow}>
                    <View style={[styles.compareArrowLine, { backgroundColor: colors.primary }]} />
                    <Feather name="arrow-right" size={20} color={colors.primary} />
                  </View>

                  {/* After */}
                  <View style={styles.beforeAfterItem}>
                    <View style={[styles.photoFrameLarge, { backgroundColor: latestPhoto.color + "22", borderColor: latestPhoto.color + "44" }]}>
                      <Feather name="user" size={40} color={latestPhoto.color} />
                      <View style={[styles.photoDateTag, { backgroundColor: latestPhoto.color }]}>
                        <Text style={styles.photoDateTagText}>
                          {new Date(latestPhoto.date + "T00:00:00").toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.beforeAfterPhase, { color: latestPhoto.color }]}>{latestPhoto.phase}</Text>
                    <Text style={[styles.beforeAfterWeight, { color: colors.foreground }]}>{latestPhoto.weight} kg</Text>
                    <Text style={[styles.beforeAfterFat, { color: colors.mutedForeground }]}>{latestPhoto.bodyFat}% gordura</Text>
                  </View>
                </View>

                {/* Summary deltas */}
                <View style={[styles.deltasRow, { backgroundColor: colors.background, borderRadius: 12 }]}>
                  <View style={styles.deltaItem}>
                    <Text style={[styles.deltaValue, { color: "#10B981" }]}>
                      -{(firstPhoto.weight - latestPhoto.weight).toFixed(1)} kg
                    </Text>
                    <Text style={[styles.deltaLabel, { color: colors.mutedForeground }]}>Peso perdido</Text>
                  </View>
                  <View style={[styles.deltaDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.deltaItem}>
                    <Text style={[styles.deltaValue, { color: "#10B981" }]}>
                      -{(firstPhoto.bodyFat - latestPhoto.bodyFat).toFixed(1)}%
                    </Text>
                    <Text style={[styles.deltaLabel, { color: colors.mutedForeground }]}>Gordura</Text>
                  </View>
                  <View style={[styles.deltaDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.deltaItem}>
                    <Text style={[styles.deltaValue, { color: "#FF5A1F" }]}>6 meses</Text>
                    <Text style={[styles.deltaLabel, { color: colors.mutedForeground }]}>Período</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Timeline */}
            <View style={styles.timelineHeader}>
              <Text style={[styles.timelineTitle, { color: colors.foreground }]}>Linha do tempo</Text>
              <Text style={[styles.timelineSub, { color: colors.mutedForeground }]}>
                {PROGRESS_PHOTOS.length} registros · últimos 6 meses
              </Text>
            </View>

            {[...PROGRESS_PHOTOS].reverse().map((photo, i) => (
              <View key={photo.id} style={[styles.photoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.photoCardTop}>
                  {/* Photo placeholder */}
                  <View style={[styles.photoFrame, { backgroundColor: photo.color + "20", borderColor: photo.color + "40" }]}>
                    <Feather name="user" size={28} color={photo.color} />
                    <View style={[styles.photoTag, { backgroundColor: photo.color }]}>
                      <Text style={styles.photoTagText}>{photo.phase}</Text>
                    </View>
                  </View>

                  {/* Info column */}
                  <View style={styles.photoCardInfo}>
                    <View style={styles.photoDateRow}>
                      <Feather name="calendar" size={12} color={colors.mutedForeground} />
                      <Text style={[styles.photoDate, { color: colors.mutedForeground }]}>
                        {new Date(photo.date + "T00:00:00").toLocaleDateString("pt-BR", {
                          day: "2-digit", month: "long", year: "numeric",
                        })}
                      </Text>
                    </View>

                    <View style={styles.photoStats}>
                      <View style={styles.photoStatItem}>
                        <Text style={[styles.photoStatVal, { color: colors.foreground }]}>{photo.weight}</Text>
                        <Text style={[styles.photoStatUnit, { color: colors.mutedForeground }]}>kg</Text>
                      </View>
                      <View style={[styles.photoStatDivider, { backgroundColor: colors.border }]} />
                      <View style={styles.photoStatItem}>
                        <Text style={[styles.photoStatVal, { color: "#F59E0B" }]}>{photo.bodyFat}</Text>
                        <Text style={[styles.photoStatUnit, { color: colors.mutedForeground }]}>% G</Text>
                      </View>
                    </View>

                    {i === 0 && (
                      <View style={[styles.latestBadge, { backgroundColor: "#ECFDF5" }]}>
                        <View style={styles.latestDot} />
                        <Text style={styles.latestBadgeText}>MAIS RECENTE</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Trainer note */}
                <View style={[styles.trainerNoteBox, { backgroundColor: colors.secondary }]}>
                  <View style={styles.trainerNoteHeader}>
                    <Feather name="message-square" size={12} color={colors.primary} />
                    <Text style={[styles.trainerNoteLabel, { color: colors.primary }]}>Observação do personal</Text>
                  </View>
                  <Text style={[styles.trainerNoteText, { color: colors.mutedForeground }]}>
                    {photo.trainerNote}
                  </Text>
                </View>
              </View>
            ))}

            {/* Empty state hint */}
            <View style={[styles.addPhotoHint, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="camera" size={20} color={colors.mutedForeground} />
              <Text style={[styles.addPhotoHintText, { color: colors.mutedForeground }]}>
                Adicione novos registros fotográficos para acompanhar sua evolução
              </Text>
              <TouchableOpacity style={[styles.addPhotoBtn, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
                <Feather name="plus" size={14} color="#FFFFFF" />
                <Text style={styles.addPhotoBtnText}>Novo registro</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontFamily: "Inter_600SemiBold" },
  addBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  tabBar: {
    flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  tabBadgeText: { color: "#FFFFFF", fontSize: 9, fontFamily: "Inter_700Bold" },
  scroll: { paddingHorizontal: 16, gap: 14, paddingTop: 14 },

  // Metrics
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
  measureRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  measureLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  measureVals: { flexDirection: "row", alignItems: "center", gap: 6 },
  measureOld: { fontSize: 13, fontFamily: "Inter_400Regular" },
  measureNew: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  measureDiff: { fontSize: 11, fontFamily: "Inter_500Medium" },
  historyRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyDate: { fontSize: 13, fontFamily: "Inter_500Medium" },
  historyVals: { flexDirection: "row", gap: 12 },
  historyVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  // Photos tab
  compareBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1,
  },
  compareBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  beforeAfterCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  beforeAfterTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  beforeAfterRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  beforeAfterItem: { flex: 1, alignItems: "center", gap: 6 },
  photoFrameLarge: {
    width: "100%", aspectRatio: 0.85, borderRadius: 14, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative",
  },
  photoDateTag: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingVertical: 5, alignItems: "center",
  },
  photoDateTagText: { color: "#FFFFFF", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  beforeAfterPhase: { fontSize: 12, fontFamily: "Inter_700Bold" },
  beforeAfterWeight: { fontSize: 16, fontFamily: "Inter_700Bold" },
  beforeAfterFat: { fontSize: 11, fontFamily: "Inter_400Regular" },
  compareArrow: { alignItems: "center", gap: 2 },
  compareArrowLine: { width: 1, height: 20, opacity: 0.3 },
  deltasRow: { flexDirection: "row", padding: 12 },
  deltaItem: { flex: 1, alignItems: "center", gap: 2 },
  deltaValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  deltaLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  deltaDivider: { width: 1, marginHorizontal: 4, opacity: 0.5 },
  timelineHeader: { gap: 2 },
  timelineTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  timelineSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  photoCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", gap: 0 },
  photoCardTop: { flexDirection: "row", gap: 14, padding: 14 },
  photoFrame: {
    width: 90, height: 110, borderRadius: 12, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
  },
  photoTag: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingVertical: 4, alignItems: "center",
  },
  photoTagText: { color: "#FFFFFF", fontSize: 9, fontFamily: "Inter_700Bold" },
  photoCardInfo: { flex: 1, gap: 8, justifyContent: "center" },
  photoDateRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  photoDate: { fontSize: 11, fontFamily: "Inter_400Regular", flex: 1 },
  photoStats: { flexDirection: "row", alignItems: "center", gap: 12 },
  photoStatItem: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  photoStatVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  photoStatUnit: { fontSize: 11, fontFamily: "Inter_400Regular" },
  photoStatDivider: { width: 1, height: 16 },
  latestBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start",
  },
  latestDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#10B981" },
  latestBadgeText: { color: "#10B981", fontSize: 8, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  trainerNoteBox: { padding: 12, gap: 5 },
  trainerNoteHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  trainerNoteLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  trainerNoteText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  addPhotoHint: {
    borderRadius: 16, borderWidth: 1, borderStyle: "dashed",
    padding: 20, alignItems: "center", gap: 10,
  },
  addPhotoHintText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  addPhotoBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  addPhotoBtnText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

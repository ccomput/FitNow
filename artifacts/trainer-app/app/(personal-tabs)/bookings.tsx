import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { TrainerImage } from "@/components/TrainerImage";

const MOCK_PERSONAL_BOOKINGS = [
  {
    id: "pb1",
    studentId: "s1",
    studentName: "Victor Santos",
    gym: "SmartFit Centro",
    date: "2026-04-10",
    time: "07:00",
    goal: "Hipertrofia",
    status: "confirmed" as const,
    imageKey: "trainer1" as const,
  },
  {
    id: "pb2",
    studentId: "s2",
    studentName: "Ana Lima",
    gym: "Bio Ritmo Paulista",
    date: "2026-04-10",
    time: "09:00",
    goal: "Emagrecimento",
    status: "confirmed" as const,
    imageKey: "trainer2" as const,
  },
  {
    id: "pb3",
    studentId: "s3",
    studentName: "Rodrigo Meireles",
    gym: "SmartFit Centro",
    date: "2026-04-09",
    time: "17:00",
    goal: "Musculação",
    status: "completed" as const,
    imageKey: "trainer3" as const,
  },
  {
    id: "pb4",
    studentId: "s4",
    studentName: "Beatriz Souza",
    gym: "Bodytech Jardins",
    date: "2026-04-11",
    time: "09:00",
    goal: "Pilates",
    status: "pending" as const,
    imageKey: "trainer2" as const,
  },
  {
    id: "pb5",
    studentId: "s5",
    studentName: "Carlos Almeida",
    gym: "SmartFit Centro",
    date: "2026-04-08",
    time: "06:00",
    goal: "HIIT",
    status: "completed" as const,
    imageKey: "trainer1" as const,
  },
];

const STATUS_CFG = {
  confirmed: { label: "Confirmado", color: "#10B981", bg: "#D1FAE5" },
  pending: { label: "Pendente", color: "#F59E0B", bg: "#FEF3C7" },
  completed: { label: "Concluído", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "Cancelado", color: "#EF4444", bg: "#FEE2E2" },
};

const FILTERS = ["Todos", "Confirmados", "Pendentes", "Concluídos"];

export default function PersonalBookingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("Todos");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = MOCK_PERSONAL_BOOKINGS.filter((b) => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Confirmados") return b.status === "confirmed";
    if (activeFilter === "Pendentes") return b.status === "pending";
    if (activeFilter === "Concluídos") return b.status === "completed";
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Reservas</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {MOCK_PERSONAL_BOOKINGS.length} no total
        </Text>
      </View>

      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterChip,
              { backgroundColor: activeFilter === f ? colors.darkSurface : colors.card, borderColor: activeFilter === f ? colors.darkSurface : colors.border },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, { color: activeFilter === f ? "#FFFFFF" : colors.foreground }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item: b }) => {
          const st = STATUS_CFG[b.status];
          return (
            <View style={[styles.bookingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <TrainerImage imageKey={b.imageKey} style={styles.photo} />
                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.studentName, { color: colors.foreground }]}>{b.studentName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                      <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                    </View>
                  </View>
                  <View style={styles.metaRow}>
                    <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{b.gym}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Feather name="calendar" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                      {new Date(b.date + "T00:00:00").toLocaleDateString("pt-BR")} · {b.time}
                    </Text>
                  </View>
                  <View style={[styles.goalChip, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.goalText, { color: colors.primary }]}>{b.goal}</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: colors.border }]}
                  onPress={() => router.push(`/personal/student-file/${b.studentId}`)}
                  activeOpacity={0.7}
                >
                  <Feather name="file-text" size={14} color={colors.foreground} />
                  <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Ver ficha</Text>
                </TouchableOpacity>

                {b.status === "confirmed" && (
                  <TouchableOpacity
                    style={[styles.actionBtnPrimary, { backgroundColor: "#10B981" }]}
                    onPress={() => router.push(`/checkin/${b.id}`)}
                    activeOpacity={0.8}
                  >
                    <Feather name="check" size={14} color="#FFFFFF" />
                    <Text style={styles.actionBtnPrimaryText}>Marcar realizado</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, gap: 2 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  filtersRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 16 },
  bookingCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  cardTop: { flexDirection: "row", gap: 14, padding: 14 },
  photo: { width: 56, height: 66, borderRadius: 12, resizeMode: "cover" },
  cardInfo: { flex: 1, gap: 5 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  studentName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  goalChip: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  goalText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  cardActions: {
    flexDirection: "row", gap: 10, paddingHorizontal: 14, paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 9, borderRadius: 10, borderWidth: 1,
  },
  actionBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  actionBtnPrimary: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 9, borderRadius: 10,
  },
  actionBtnPrimaryText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
});

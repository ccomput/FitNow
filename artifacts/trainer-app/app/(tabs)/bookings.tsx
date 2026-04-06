import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { TrainerImage } from "@/components/TrainerImage";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmado", color: "#10B981", bg: "#D1FAE5" },
  pending: { label: "Pendente", color: "#F59E0B", bg: "#FEF3C7" },
  completed: { label: "Concluído", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "Cancelado", color: "#EF4444", bg: "#FEE2E2" },
};

export default function BookingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Meus agendamentos
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          {bookings.length} sessões no total
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Próximos treinos
            </Text>
            {upcoming.map((booking) => {
              const status = STATUS_CONFIG[booking.status];
              return (
                <View
                  key={booking.id}
                  style={[
                    styles.bookingCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.cardTop}>
                    <TrainerImage
                      imageKey={booking.imageKey}
                      style={styles.trainerPhoto}
                    />
                    <View style={styles.cardInfo}>
                      <View style={styles.cardTitleRow}>
                        <Text
                          style={[styles.trainerName, { color: colors.foreground }]}
                        >
                          {booking.trainerName}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                          <Text style={[styles.statusText, { color: status.color }]}>
                            {status.label}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.gymName, { color: colors.mutedForeground }]}>
                        {booking.gymName}
                      </Text>
                      <View style={styles.cardMeta}>
                        <View style={styles.metaItem}>
                          <Feather name="calendar" size={12} color={colors.mutedForeground} />
                          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                            {formatDate(booking.date)}
                          </Text>
                        </View>
                        <View style={styles.metaDot} />
                        <View style={styles.metaItem}>
                          <Feather name="clock" size={12} color={colors.mutedForeground} />
                          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                            {booking.time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
                    <View style={[styles.typeChip, { backgroundColor: colors.accent }]}>
                      <Feather name="activity" size={12} color={colors.primary} />
                      <Text style={[styles.typeText, { color: colors.primary }]}>
                        {booking.type}
                      </Text>
                    </View>
                    <Text style={[styles.priceText, { color: colors.foreground }]}>
                      R$ {booking.price}
                    </Text>
                  </View>

                  {booking.status === "confirmed" && (
                    <TouchableOpacity
                      style={[styles.cancelBtn, { borderColor: colors.border }]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>
                        Cancelar agendamento
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {past.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Histórico
            </Text>
            {past.map((booking) => {
              const status = STATUS_CONFIG[booking.status];
              return (
                <View
                  key={booking.id}
                  style={[
                    styles.bookingCard,
                    styles.pastCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.cardTop}>
                    <TrainerImage
                      imageKey={booking.imageKey}
                      style={[styles.trainerPhoto, { opacity: 0.7 }]}
                    />
                    <View style={styles.cardInfo}>
                      <View style={styles.cardTitleRow}>
                        <Text
                          style={[styles.trainerName, { color: colors.mutedForeground }]}
                        >
                          {booking.trainerName}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                          <Text style={[styles.statusText, { color: status.color }]}>
                            {status.label}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.gymName, { color: colors.mutedForeground }]}>
                        {booking.gymName}
                      </Text>
                      <View style={styles.cardMeta}>
                        <View style={styles.metaItem}>
                          <Feather name="calendar" size={12} color={colors.mutedForeground} />
                          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                            {formatDate(booking.date)}
                          </Text>
                        </View>
                        <View style={styles.metaDot} />
                        <View style={styles.metaItem}>
                          <Feather name="clock" size={12} color={colors.mutedForeground} />
                          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                            {booking.time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {booking.status === "completed" && (
                    <TouchableOpacity
                      style={[styles.rebookBtn, { backgroundColor: colors.accent, borderColor: colors.primary }]}
                      onPress={() => router.push("/filters")}
                      activeOpacity={0.8}
                    >
                      <Feather name="repeat" size={14} color={colors.primary} />
                      <Text style={[styles.rebookText, { color: colors.primary }]}>
                        Agendar novamente
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {bookings.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhum agendamento
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
              Que tal agendar seu primeiro treino com um personal trainer?
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/filters")}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>Buscar personais</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 4,
  },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24 },
  section: { gap: 12 },
  sectionLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", paddingHorizontal: 4 },
  bookingCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    gap: 0,
  },
  pastCard: { opacity: 0.85 },
  cardTop: {
    flexDirection: "row",
    gap: 14,
    padding: 14,
    alignItems: "flex-start",
  },
  trainerPhoto: {
    width: 60,
    height: 74,
    borderRadius: 12,
    resizeMode: "cover",
  },
  cardInfo: { flex: 1, gap: 4 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  trainerName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  gymName: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D1D5DB",
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  priceText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cancelBtn: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  rebookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginHorizontal: 14,
    marginBottom: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  rebookText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_600SemiBold" },
  emptyDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  emptyBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  emptyBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

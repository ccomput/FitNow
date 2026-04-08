import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { TRAINERS, GYMS } from "@/data/mockData";
import { TrainerImage } from "@/components/TrainerImage";
import { useApp } from "@/context/AppContext";

type SessionType = "regular" | "assessment" | "reeval";

const SESSION_TYPES: { id: SessionType; label: string; shortLabel: string; desc: string; duration: number; icon: string; color: string; bg: string }[] = [
  {
    id: "regular", label: "Aula avulsa", shortLabel: "Aula", icon: "activity",
    desc: "Treino baseado no seu plano atual",
    duration: 60, color: "#6B7280", bg: "#F3F4F6",
  },
  {
    id: "assessment", label: "Avaliação + Aula Inicial", shortLabel: "Avaliação", icon: "award",
    desc: "Anamnese, avaliação e montagem do treino inicial",
    duration: 90, color: "#FF5A1F", bg: "#FFF0EB",
  },
  {
    id: "reeval", label: "Reavaliação", shortLabel: "Reavaliação", icon: "refresh-cw",
    desc: "Atualização do progresso e ajuste do treino",
    duration: 90, color: "#10B981", bg: "#ECFDF5",
  },
];

export default function BookingConfirmScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trainerId, gymId, slot, sessionType: initialSessionType } = useLocalSearchParams<{
    trainerId: string;
    gymId: string;
    slot: string;
    sessionType?: SessionType;
  }>();
  const { filters } = useApp();

  const trainer = TRAINERS.find((t) => t.id === trainerId);
  const gym = GYMS.find((g) => g.id === gymId);

  const [sessionType, setSessionType] = useState<SessionType>(initialSessionType ?? "regular");
  const selectedSession = SESSION_TYPES.find((s) => s.id === sessionType)!;
  const [selectedDuration, setSelectedDuration] = useState<60 | 90>(selectedSession.duration as 60 | 90);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!trainer || !gym) return null;

  const totalPrice = Math.round((trainer.pricePerHour * selectedDuration) / 60);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Confirmar reserva
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.trainerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TrainerImage imageKey={trainer.imageKey} style={styles.trainerPhoto} />
          <View style={styles.trainerCardInfo}>
            <Text style={[styles.trainerName, { color: colors.foreground }]}>
              {trainer.name}
            </Text>
            <Text style={[styles.gymName, { color: colors.mutedForeground }]}>
              {gym.name}
            </Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{trainer.rating}</Text>
              <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                ({trainer.reviewCount} avaliações)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tipo de sessão</Text>
          <View style={styles.sessionTypeList}>
            {SESSION_TYPES.map((s) => {
              const isSelected = sessionType === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => { setSessionType(s.id); setSelectedDuration(s.duration as 60 | 90); }}
                  style={[
                    styles.sessionTypeCard,
                    {
                      backgroundColor: isSelected ? s.bg : colors.card,
                      borderColor: isSelected ? s.color : colors.border,
                      borderWidth: isSelected ? 1.5 : 1,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.sessionTypeIcon, { backgroundColor: isSelected ? s.color + "20" : colors.secondary }]}>
                    <Feather name={s.icon as any} size={16} color={isSelected ? s.color : colors.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionTypeLabel, { color: isSelected ? s.color : colors.foreground }]}>{s.label}</Text>
                    <Text style={[styles.sessionTypeDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
                  </View>
                  {isSelected && <Feather name="check-circle" size={16} color={s.color} />}
                </TouchableOpacity>
              );
            })}
          </View>
          {sessionType === "assessment" && (
            <View style={[styles.assessmentNote, { backgroundColor: "#FFF0EB" }]}>
              <Feather name="info" size={13} color="#FF5A1F" />
              <Text style={[styles.assessmentNoteText, { color: "#C2410C" }]}>
                A Avaliação + Aula Inicial dura 90 minutos e inclui anamnese, avaliação física e criação do seu treino inicial.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Detalhes da sessão
          </Text>

          <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <DetailRow
              icon="calendar"
              label="Data"
              value={formatDate(filters.date)}
              colors={colors}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <DetailRow
              icon="clock"
              label="Horário"
              value={slot}
              colors={colors}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <DetailRow
              icon="activity"
              label="Tipo de treino"
              value={filters.trainingType}
              colors={colors}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <DetailRow
              icon="map-pin"
              label="Local"
              value={gym.name}
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Duração da sessão
          </Text>
          <View style={styles.durationRow}>
            {([60, 90] as const).map((dur) => {
              const isSelected = selectedDuration === dur;
              const price = Math.round((trainer.pricePerHour * dur) / 60);
              return (
                <TouchableOpacity
                  key={dur}
                  onPress={() => setSelectedDuration(dur)}
                  style={[
                    styles.durationCard,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                      flex: 1,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.durationTime, { color: isSelected ? colors.primary : colors.foreground }]}>
                    {dur} min
                  </Text>
                  <Text style={[styles.durationPrice, { color: isSelected ? colors.primary : colors.mutedForeground }]}>
                    R$ {price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Resumo de pagamento
          </Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                Sessão ({selectedDuration} min)
              </Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                R$ {totalPrice}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                Taxa de serviço
              </Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                R$ 9,90
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 8 }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryTotalLabel, { color: colors.foreground }]}>
                Total
              </Text>
              <Text style={[styles.summaryTotal, { color: colors.primary }]}>
                R$ {totalPrice + 9}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.cancelPolicy, { backgroundColor: colors.secondary }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>
            Cancelamento gratuito até 24h antes do treino.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 12,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: colors.primary }]}
          onPress={() =>
            router.push({
              pathname: "/booking/payment",
              params: {
                trainerId,
                gymId,
                slot,
                duration: selectedDuration.toString(),
                total: (totalPrice + 9).toString(),
              },
            })
          }
          activeOpacity={0.85}
        >
          <Feather name="credit-card" size={18} color="#FFFFFF" />
          <Text style={styles.payBtnText}>Ir para pagamento · R$ {totalPrice + 9}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  colors,
}: {
  icon: string;
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.detailRow}>
      <Feather name={icon as any} size={16} color={colors.mutedForeground} />
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

function formatDate(date: string) {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 24 },
  trainerCard: {
    flexDirection: "row",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  trainerPhoto: { width: 64, height: 76, borderRadius: 12, resizeMode: "cover" },
  trainerCardInfo: { flex: 1, gap: 4 },
  trainerName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  gymName: { fontSize: 13, fontFamily: "Inter_400Regular" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#92400E" },
  reviewCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  detailsSection: { gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  detailsCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailLabel: { fontSize: 13, fontFamily: "Inter_400Regular", width: 90 },
  detailValue: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1, textAlign: "right" },
  divider: { height: StyleSheet.hairlineWidth },
  durationRow: { flexDirection: "row", gap: 12 },
  durationCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  durationTime: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  durationPrice: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_500Medium" },
  summaryTotalLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  summaryTotal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  sessionTypeList: { gap: 8 },
  sessionTypeCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14 },
  sessionTypeIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  sessionTypeLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sessionTypeDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  assessmentNote: { flexDirection: "row", gap: 8, padding: 12, borderRadius: 10, alignItems: "flex-start", marginTop: 4 },
  assessmentNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  cancelPolicy: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  cancelText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 18 },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  payBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

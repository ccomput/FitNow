import React from "react";
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
import { GYMS, TRAINERS } from "@/data/mockData";
import { TrainerImage } from "@/components/TrainerImage";
import { useApp } from "@/context/AppContext";

export default function GymTrainersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { gymId } = useLocalSearchParams<{ gymId: string }>();
  const { filters } = useApp();

  const gym = GYMS.find((g) => g.id === gymId);
  const trainers = TRAINERS.filter((t) => t.gymId === gymId);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!gym) return null;

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
        <View style={styles.headerInfo}>
          <Text style={[styles.gymName, { color: colors.foreground }]} numberOfLines={1}>
            {gym.name}
          </Text>
          <Text style={[styles.gymAddress, { color: colors.mutedForeground }]} numberOfLines={1}>
            {gym.address}
          </Text>
        </View>
      </View>

      <View style={[styles.filterBar, { borderBottomColor: colors.border }]}>
        <View style={[styles.filterChip, { backgroundColor: colors.accent }]}>
          <Feather name="calendar" size={13} color={colors.primary} />
          <Text style={[styles.filterChipText, { color: colors.primary }]}>
            {filters.date.split("-").slice(1).reverse().join("/")} · {filters.time}
          </Text>
        </View>
        <View style={[styles.filterChip, { backgroundColor: colors.secondary }]}>
          <Feather name="activity" size={13} color={colors.mutedForeground} />
          <Text style={[styles.filterChipText, { color: colors.mutedForeground }]}>
            {filters.trainingType}
          </Text>
        </View>
        <Text style={[styles.trainerCount, { color: colors.mutedForeground }]}>
          {trainers.length} disponíveis
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {trainers.map((trainer) => (
          <TouchableOpacity
            key={trainer.id}
            style={[styles.trainerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/trainer/${trainer.id}`)}
            activeOpacity={0.8}
          >
            <TrainerImage
              imageKey={trainer.imageKey}
              style={styles.trainerPhoto}
            />
            <View style={styles.trainerInfo}>
              <View style={styles.trainerNameRow}>
                <Text style={[styles.trainerName, { color: colors.foreground }]}>
                  {trainer.name}
                </Text>
                <View style={styles.ratingBadge}>
                  <Feather name="star" size={11} color="#F59E0B" />
                  <Text style={styles.ratingText}>{trainer.rating}</Text>
                </View>
              </View>

              <View style={styles.specialtyRow}>
                {trainer.specialty.slice(0, 2).map((s) => (
                  <View
                    key={s}
                    style={[styles.specialtyTag, { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.specialtyTagText, { color: colors.mutedForeground }]}>
                      {s}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.primary }]}>
                  R$ {trainer.pricePerHour}
                  <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>
                    /hora
                  </Text>
                </Text>
                <Text style={[styles.exp, { color: colors.mutedForeground }]}>
                  {trainer.experience} anos exp.
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.slotsScroll}
              >
                <View style={styles.slotsRow}>
                  {trainer.availableSlots.slice(0, 5).map((slot) => (
                    <View
                      key={slot}
                      style={[
                        styles.slotChip,
                        {
                          backgroundColor:
                            slot === filters.time ? colors.accent : colors.secondary,
                          borderColor:
                            slot === filters.time ? colors.primary : "transparent",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          {
                            color:
                              slot === filters.time
                                ? colors.primary
                                : colors.mutedForeground,
                            fontFamily:
                              slot === filters.time
                                ? "Inter_600SemiBold"
                                : "Inter_400Regular",
                          },
                        ]}
                      >
                        {slot}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerInfo: { flex: 1 },
  gymName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  gymAddress: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  filterChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  trainerCount: { marginLeft: "auto", fontSize: 13, fontFamily: "Inter_400Regular" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14 },
  trainerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  trainerPhoto: {
    width: 72,
    height: 88,
    borderRadius: 12,
    resizeMode: "cover",
  },
  trainerInfo: { flex: 1, gap: 6 },
  trainerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trainerName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "#FFFBEB",
  },
  ratingText: {
    fontSize: 12,
    color: "#92400E",
    fontFamily: "Inter_600SemiBold",
  },
  specialtyRow: { flexDirection: "row", gap: 6 },
  specialtyTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specialtyTagText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 15, fontFamily: "Inter_700Bold" },
  priceUnit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  exp: { fontSize: 12, fontFamily: "Inter_400Regular" },
  slotsScroll: { marginTop: 2 },
  slotsRow: { flexDirection: "row", gap: 6 },
  slotChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  slotText: { fontSize: 12 },
});

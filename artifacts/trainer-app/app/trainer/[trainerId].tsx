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

export default function TrainerProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trainerId } = useLocalSearchParams<{ trainerId: string }>();
  const { filters } = useApp();

  const trainer = TRAINERS.find((t) => t.id === trainerId);
  const gym = trainer ? GYMS.find((g) => g.id === trainer.gymId) : null;

  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    trainer?.availableSlots.includes(filters.time) ? filters.time : null
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!trainer || !gym) return null;

  const handleBook = () => {
    if (!selectedSlot) return;
    router.push({
      pathname: "/booking/confirm",
      params: {
        trainerId: trainer.id,
        gymId: gym.id,
        slot: selectedSlot,
      },
    });
  };

  const reviews = [
    { name: "Marcelo F.", text: "Treino incrível, resultado em 2 meses!", stars: 5 },
    { name: "Carla S.", text: "Muito profissional e pontual. Recomendo!", stars: 5 },
    { name: "João P.", text: "Excelente metodologia, superou minhas expectativas.", stars: 4 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 100 }}
      >
        <View style={[styles.heroSection, { backgroundColor: colors.darkSurface }]}>
          <View style={[styles.heroTopNav, { paddingTop: topPad + 8 }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtnDark}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backBtnDark} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.trainerImageWrapper}>
              <TrainerImage imageKey={trainer.imageKey} style={styles.trainerHeroPhoto} />
              <View style={[styles.onlineBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.onlineBadgeText}>Online</Text>
              </View>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{trainer.name}</Text>
              <Text style={styles.heroGym}>{gym.name}</Text>

              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Feather name="star" size={14} color="#F59E0B" />
                  <Text style={styles.heroStatVal}>{trainer.rating}</Text>
                  <Text style={styles.heroStatLabel}>({trainer.reviewCount})</Text>
                </View>
                <View style={styles.heroDot} />
                <View style={styles.heroStat}>
                  <Feather name="users" size={13} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.heroStatVal}>{trainer.totalClients}</Text>
                  <Text style={styles.heroStatLabel}>alunos</Text>
                </View>
                <View style={styles.heroDot} />
                <View style={styles.heroStat}>
                  <Feather name="award" size={13} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.heroStatVal}>{trainer.experience}a</Text>
                  <Text style={styles.heroStatLabel}>exp.</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
              Por hora
            </Text>
            <Text style={[styles.priceValue, { color: colors.primary }]}>
              R$ {trainer.pricePerHour}
            </Text>
          </View>

          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Especialidades
            </Text>
            <View style={styles.tagsRow}>
              {trainer.specialty.map((s) => (
                <View key={s} style={[styles.specialtyTag, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.specialtyTagText, { color: colors.primary }]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sobre</Text>
            <Text style={[styles.bioText, { color: colors.mutedForeground }]}>
              {trainer.bio}
            </Text>
          </View>

          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Certificações
            </Text>
            <View style={styles.certsCol}>
              {trainer.certifications.map((c) => (
                <View key={c} style={styles.certRow}>
                  <View style={[styles.certDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.certText, { color: colors.foreground }]}>{c}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Horários disponíveis
            </Text>
            <View style={styles.slotsGrid}>
              {trainer.availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => setSelectedSlot(slot)}
                    style={[
                      styles.slotBtn,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.slotBtnText,
                        { color: isSelected ? "#FFFFFF" : colors.foreground },
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Avaliações recentes
            </Text>
            <View style={styles.reviewsCol}>
              {reviews.map((r, i) => (
                <View
                  key={i}
                  style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.reviewHeader}>
                    <View style={[styles.reviewAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                    </View>
                    <View>
                      <Text style={[styles.reviewName, { color: colors.foreground }]}>{r.name}</Text>
                      <View style={styles.starsRow}>
                        {Array.from({ length: r.stars }).map((_, si) => (
                          <Feather key={si} name="star" size={11} color="#F59E0B" />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.reviewText, { color: colors.mutedForeground }]}>
                    {r.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
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
        <View style={styles.bottomBarInfo}>
          <Text style={[styles.bottomPrice, { color: colors.foreground }]}>
            R$ {trainer.pricePerHour}
          </Text>
          <Text style={[styles.bottomSlot, { color: colors.mutedForeground }]}>
            {selectedSlot ? `Horário: ${selectedSlot}` : "Selecione um horário"}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookBtn,
            { backgroundColor: selectedSlot ? colors.primary : colors.muted },
          ]}
          onPress={handleBook}
          activeOpacity={0.85}
          disabled={!selectedSlot}
        >
          <Text
            style={[
              styles.bookBtnText,
              { color: selectedSlot ? "#FFFFFF" : colors.mutedForeground },
            ]}
          >
            Agendar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroSection: {
    paddingBottom: 24,
  },
  heroTopNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtnDark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
    alignItems: "flex-end",
  },
  trainerImageWrapper: { position: "relative" },
  trainerHeroPhoto: {
    width: 100,
    height: 120,
    borderRadius: 16,
    resizeMode: "cover",
  },
  onlineBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  onlineBadgeText: { color: "#FFFFFF", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  heroInfo: { flex: 1, gap: 6 },
  heroName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  heroGym: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  heroStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  heroStatVal: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  heroStatLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Inter_400Regular" },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  body: { paddingHorizontal: 20 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  priceLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  priceValue: { fontSize: 24, fontFamily: "Inter_700Bold" },
  section: {
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  specialtyTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  specialtyTagText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  bioText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  certsCol: { gap: 8 },
  certRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  certDot: { width: 6, height: 6, borderRadius: 3 },
  certText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slotBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  slotBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  reviewsCol: { gap: 12 },
  reviewCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  reviewName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  starsRow: { flexDirection: "row", gap: 2, marginTop: 2 },
  reviewText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  bottomBarInfo: { flex: 1 },
  bottomPrice: { fontSize: 20, fontFamily: "Inter_700Bold" },
  bottomSlot: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  bookBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

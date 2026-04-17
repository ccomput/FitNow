import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { GYMS, TRAINERS, type Gym } from "@/data/mockData";
import { TrainerImage } from "@/components/TrainerImage";
import { MapViewWrapper } from "@/components/MapViewWrapper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { filters, viewMode, setViewMode } = useApp();

  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const openSheet = useCallback((gym: Gym) => {
    setSelectedGym(gym);
    setSheetVisible(true);
    Animated.spring(sheetAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [sheetAnim]);

  const closeSheet = useCallback(() => {
    Animated.timing(sheetAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      setSheetVisible(false);
      setSelectedGym(null);
    });
  }, [sheetAnim]);

  const handleViewTrainers = (gym: Gym) => {
    closeSheet();
    setTimeout(() => {
      router.push(`/gym/${gym.id}/trainers`);
    }, 200);
  };

  const gymTrainers = selectedGym
    ? TRAINERS.filter((t) => t.gymId === selectedGym.id)
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          style={[styles.filterSummary, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push("/filters")}
          activeOpacity={0.8}
        >
          <Feather name="sliders" size={15} color={colors.primary} />
          <View style={styles.filterTexts}>
            <Text style={[styles.filterDate, { color: colors.foreground }]}>
              {formatDate(filters.date)} · {filters.time}
            </Text>
            <Text style={[styles.filterType, { color: colors.mutedForeground }]}>
              {filters.trainingType} · {filters.mode}
            </Text>
          </View>
          <View style={[styles.changePill, { backgroundColor: colors.primary }]}>
            <Text style={styles.changePillText}>Alterar</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.viewToggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => setViewMode("map")}
            style={[
              styles.toggleBtn,
              viewMode === "map" && { backgroundColor: colors.primary },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name="map"
              size={16}
              color={viewMode === "map" ? "#FFFFFF" : colors.mutedForeground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            style={[
              styles.toggleBtn,
              viewMode === "list" && { backgroundColor: colors.primary },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name="list"
              size={16}
              color={viewMode === "list" ? "#FFFFFF" : colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipStrip}
        style={[styles.chipStripWrapper, { top: topPad + 60 }]}
      >
        <TouchableOpacity
          style={[styles.bannerChip, { backgroundColor: colors.darkSurface }]}
          onPress={() => router.push("/assessment/info")}
          activeOpacity={0.85}
        >
          <View style={[styles.bannerChipIcon, { backgroundColor: "rgba(255,90,31,0.25)" }]}>
            <Feather name="award" size={13} color="#FF5A1F" />
          </View>
          <Text style={styles.bannerChipText}>Avaliação + Aula Inicial</Text>
          <Feather name="chevron-right" size={13} color="rgba(255,255,255,0.45)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bannerChip, { backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#FDE68A" }]}
          onPress={() => router.push("/assessment/reeval")}
          activeOpacity={0.85}
        >
          <View style={[styles.bannerChipIcon, { backgroundColor: "rgba(245,158,11,0.2)" }]}>
            <Feather name="refresh-cw" size={13} color="#F59E0B" />
          </View>
          <Text style={[styles.bannerChipText, { color: "#92400E" }]}>Reavaliação em julho</Text>
          <Feather name="chevron-right" size={13} color="#B45309" />
        </TouchableOpacity>
      </ScrollView>

      {viewMode === "map" ? (
        <View style={styles.mapContainer}>
          <MapViewWrapper selectedGym={selectedGym} onGymPress={openSheet} />

          <TouchableOpacity
            style={[styles.myLocationBtn, {
              backgroundColor: colors.card,
              borderColor: colors.border,
              bottom: bottomPad + 100,
            }]}
            activeOpacity={0.8}
          >
            <Feather name="navigation" size={18} color={colors.primary} />
          </TouchableOpacity>

          <View style={[styles.resultsLabel, { bottom: bottomPad + 100 }]}>
            <View style={[styles.resultsLabelBg, { backgroundColor: colors.darkSurface }]}>
              <Text style={styles.resultsLabelText}>
                {GYMS.length} academias · {GYMS.reduce((acc, g) => acc + g.availableTrainers, 0)} personais
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={GYMS}
          keyExtractor={(g) => g.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomPad + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: gym }) => (
            <TouchableOpacity
              style={[styles.gymListCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/gym/${gym.id}/trainers`)}
              activeOpacity={0.8}
            >
              <View style={styles.gymListCardLeft}>
                <View style={[styles.gymBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.gymBadgeCount}>{gym.availableTrainers}</Text>
                </View>
                <View style={styles.gymInfo}>
                  <Text style={[styles.gymName, { color: colors.foreground }]}>
                    {gym.name}
                  </Text>
                  <Text style={[styles.gymAddress, { color: colors.mutedForeground }]}>
                    {gym.address}
                  </Text>
                  <View style={styles.gymMeta}>
                    <Feather name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.gymRating, { color: colors.foreground }]}>
                      {gym.rating}
                    </Text>
                    <Text style={[styles.gymDist, { color: colors.mutedForeground }]}>
                      · {gym.distance}
                    </Text>
                  </View>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        />
      )}

      {sheetVisible && (
        <Modal transparent visible={sheetVisible} animationType="none">
          <TouchableOpacity
            style={styles.overlay}
            onPress={closeSheet}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                backgroundColor: colors.background,
                paddingBottom: bottomPad + 16,
                transform: [{ translateY: sheetAnim }],
              },
            ]}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.muted }]} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetGymInfo}>
                <Text style={[styles.sheetGymName, { color: colors.foreground }]}>
                  {selectedGym?.name}
                </Text>
                <View style={styles.sheetGymMeta}>
                  <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.sheetGymAddr, { color: colors.mutedForeground }]}>
                    {selectedGym?.address}
                  </Text>
                </View>
              </View>
              <View style={styles.sheetGymStats}>
                <View style={styles.sheetGymStat}>
                  <Feather name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.sheetStatVal, { color: colors.foreground }]}>
                    {selectedGym?.rating}
                  </Text>
                </View>
                <Text style={[styles.sheetDist, { color: colors.mutedForeground }]}>
                  {selectedGym?.distance}
                </Text>
              </View>
            </View>

            <View style={styles.amenitiesRow}>
              {selectedGym?.amenities.map((a) => (
                <View
                  key={a}
                  style={[styles.amenityChip, { backgroundColor: colors.secondary }]}
                >
                  <Text style={[styles.amenityText, { color: colors.mutedForeground }]}>{a}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

            <View style={styles.sheetTrainersHeader}>
              <Text style={[styles.sheetTrainersTitle, { color: colors.foreground }]}>
                {gymTrainers.length} personais disponíveis
              </Text>
              <TouchableOpacity onPress={() => selectedGym && handleViewTrainers(selectedGym)}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trainersRow}>
              {gymTrainers.slice(0, 4).map((trainer) => (
                <TouchableOpacity
                  key={trainer.id}
                  style={[styles.miniTrainerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => {
                    closeSheet();
                    setTimeout(() => router.push(`/trainer/${trainer.id}`), 200);
                  }}
                  activeOpacity={0.8}
                >
                  <TrainerImage imageKey={trainer.imageKey} style={styles.miniTrainerPhoto} />
                  <View style={styles.miniTrainerInfo}>
                    <Text style={[styles.miniTrainerName, { color: colors.foreground }]} numberOfLines={1}>
                      {trainer.name.split(" ")[0]}
                    </Text>
                    <View style={styles.miniRatingRow}>
                      <Feather name="star" size={10} color="#F59E0B" />
                      <Text style={styles.miniRating}>{trainer.rating}</Text>
                    </View>
                    <Text style={[styles.miniPrice, { color: colors.primary }]}>
                      R$ {trainer.pricePerHour}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.sheetCta, { backgroundColor: colors.primary }]}
              onPress={() => selectedGym && handleViewTrainers(selectedGym)}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetCtaText}>
                Ver todos os personais
              </Text>
              <Feather name="arrow-right" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterSummary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  filterTexts: { flex: 1 },
  filterDate: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  filterType: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  changePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  changePillText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Inter_500Medium" },
  viewToggle: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: { flex: 1 },
  myLocationBtn: {
    position: "absolute",
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsLabel: {
    position: "absolute",
    left: 16,
  },
  resultsLabelBg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultsLabelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  listContent: { padding: 16, gap: 12 },
  gymListCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  gymListCardLeft: { flex: 1, flexDirection: "row", gap: 14, alignItems: "center" },
  gymBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  gymBadgeCount: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  gymInfo: { flex: 1, gap: 2 },
  gymName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  gymAddress: { fontSize: 12, fontFamily: "Inter_400Regular" },
  gymMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  gymRating: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  gymDist: { fontSize: 12, fontFamily: "Inter_400Regular" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sheetGymInfo: { flex: 1, gap: 4 },
  sheetGymName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  sheetGymMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  sheetGymAddr: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sheetGymStats: { alignItems: "flex-end", gap: 4 },
  sheetGymStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  sheetStatVal: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sheetDist: { fontSize: 12, fontFamily: "Inter_400Regular" },
  amenitiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  amenityChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  amenityText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sheetDivider: { height: StyleSheet.hairlineWidth },
  sheetTrainersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTrainersTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  trainersRow: { gap: 12, paddingRight: 4 },
  miniTrainerCard: {
    width: 100,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    gap: 0,
  },
  miniTrainerPhoto: { width: 100, height: 90, resizeMode: "cover" },
  miniTrainerInfo: { padding: 8, gap: 3 },
  miniTrainerName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  miniRatingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  miniRating: { fontSize: 11, color: "#92400E", fontFamily: "Inter_500Medium" },
  miniPrice: { fontSize: 12, fontFamily: "Inter_700Bold" },
  sheetCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  sheetCtaText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  chipStripWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 5,
  },
  chipStrip: { paddingHorizontal: 16, paddingVertical: 6, gap: 8, alignItems: "center" },
  bannerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerChipIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerChipText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
});

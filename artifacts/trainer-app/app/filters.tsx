import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { TRAINING_TYPES } from "@/data/mockData";

const DATES = [
  { label: "Hoje", value: "2026-04-06", day: "06", weekday: "Seg" },
  { label: "Amanhã", value: "2026-04-07", day: "07", weekday: "Ter" },
  { label: "", value: "2026-04-08", day: "08", weekday: "Qua" },
  { label: "", value: "2026-04-09", day: "09", weekday: "Qui" },
  { label: "", value: "2026-04-10", day: "10", weekday: "Sex" },
  { label: "", value: "2026-04-11", day: "11", weekday: "Sáb" },
  { label: "", value: "2026-04-12", day: "12", weekday: "Dom" },
];

const TIMES = [
  "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export default function FiltersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { filters, setFilters } = useApp();

  const [selectedDate, setSelectedDate] = useState(filters.date);
  const [selectedTime, setSelectedTime] = useState(filters.time);
  const [selectedMode, setSelectedMode] = useState<"Presencial" | "Online">(filters.mode);
  const [selectedType, setSelectedType] = useState(filters.trainingType);

  const handleSearch = () => {
    setFilters({
      date: selectedDate,
      time: selectedTime,
      mode: selectedMode,
      trainingType: selectedType,
    });
    router.push("/(tabs)/");
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              Bom dia!
            </Text>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Agendar treino
            </Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>V</Text>
          </View>
        </View>

        <View style={[styles.locationBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="map-pin" size={16} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.foreground }]}>
            Av. Paulista, São Paulo
          </Text>
          <TouchableOpacity>
            <Text style={[styles.changeBtn, { color: colors.primary }]}>
              Alterar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Data
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesRow}
          >
            {DATES.map((d) => {
              const isSelected = selectedDate === d.value;
              return (
                <TouchableOpacity
                  key={d.value}
                  onPress={() => setSelectedDate(d.value)}
                  style={[
                    styles.dateCard,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  {d.label ? (
                    <Text
                      style={[
                        styles.dateTodayLabel,
                        { color: isSelected ? "rgba(255,255,255,0.8)" : colors.primary },
                      ]}
                    >
                      {d.label}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.dateWeekday,
                        { color: isSelected ? "rgba(255,255,255,0.7)" : colors.mutedForeground },
                      ]}
                    >
                      {d.weekday}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.dateDay,
                      { color: isSelected ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {d.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Horário
          </Text>
          <View style={styles.timesGrid}>
            {TIMES.map((t) => {
              const isSelected = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.timeText,
                      { color: isSelected ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Modalidade
          </Text>
          <View style={styles.modeRow}>
            {(["Presencial", "Online"] as const).map((m) => {
              const isSelected = selectedMode === m;
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => setSelectedMode(m)}
                  style={[
                    styles.modeBtn,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                      flex: 1,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={m === "Presencial" ? "map-pin" : "video"}
                    size={18}
                    color={isSelected ? "#FFFFFF" : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.modeText,
                      { color: isSelected ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Objetivo do Treino
          </Text>
          <View style={styles.typesGrid}>
            {TRAINING_TYPES.map((type) => {
              const isSelected = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: isSelected ? colors.primary : colors.mutedForeground },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: colors.background,
            paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 16,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
          activeOpacity={0.85}
        >
          <Feather name="search" size={20} color="#FFFFFF" />
          <Text style={styles.searchBtnText}>Ver personais disponíveis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 14, fontFamily: "Inter_400Regular" },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  changeBtn: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 28 },
  section: { gap: 14 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  datesRow: { gap: 10, paddingRight: 20 },
  dateCard: {
    width: 60,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 4,
  },
  dateTodayLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  dateWeekday: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dateDay: { fontSize: 20, fontFamily: "Inter_700Bold" },
  timesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  modeRow: { flexDirection: "row", gap: 12 },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  modeText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  typesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  searchBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});

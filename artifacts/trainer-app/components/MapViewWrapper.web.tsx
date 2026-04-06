import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { GYMS, type Gym } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface Props {
  selectedGym: Gym | null;
  onGymPress: (gym: Gym) => void;
}

const MARKER_POSITIONS = [
  { top: "38%", left: "47%" },
  { top: "28%", left: "30%" },
  { top: "58%", left: "62%" },
  { top: "20%", left: "65%" },
  { top: "65%", left: "28%" },
];

export function MapViewWrapper({ selectedGym, onGymPress }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: "#DCE8E0" }]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`h${i}`}
          style={[
            styles.hLine,
            { top: `${(i + 1) * 11}%`, borderColor: "rgba(0,0,0,0.06)" },
          ]}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`v${i}`}
          style={[
            styles.vLine,
            { left: `${(i + 1) * 11}%`, borderColor: "rgba(0,0,0,0.06)" },
          ]}
        />
      ))}

      <View style={[styles.road1, { backgroundColor: "#C9D8CC" }]} />
      <View style={[styles.road2, { backgroundColor: "#C9D8CC" }]} />
      <View style={[styles.road3, { backgroundColor: "#C9D8CC" }]} />

      <View style={[styles.mapLabelContainer, { top: 16, alignSelf: "center" }]}>
        <View style={[styles.mapLabelBg, { backgroundColor: colors.darkSurface }]}>
          <Feather name="map" size={12} color="#FFFFFF" />
          <Text style={styles.mapLabelText}>Mapa interativo · disponível no app nativo</Text>
        </View>
      </View>

      {GYMS.map((gym, i) => {
        const pos = MARKER_POSITIONS[i % MARKER_POSITIONS.length];
        const isSelected = selectedGym?.id === gym.id;

        return (
          <TouchableOpacity
            key={gym.id}
            style={[
              styles.marker,
              pos,
              {
                backgroundColor: isSelected ? colors.darkSurface : colors.primary,
                borderColor: "#FFFFFF",
                shadowColor: isSelected ? colors.darkSurface : colors.primary,
              },
            ]}
            onPress={() => onGymPress(gym)}
            activeOpacity={0.8}
          >
            <Text style={styles.markerCount}>{gym.availableTrainers}</Text>
          </TouchableOpacity>
        );
      })}

      <View style={[styles.legend, { backgroundColor: "rgba(255,255,255,0.9)", borderColor: "rgba(0,0,0,0.08)" }]}>
        <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.legendText, { color: colors.foreground }]}>
          Número de personais disponíveis
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  hLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  vLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
  },
  road1: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    height: 12,
  },
  road2: {
    position: "absolute",
    left: "48%",
    top: 0,
    bottom: 0,
    width: 10,
  },
  road3: {
    position: "absolute",
    top: "65%",
    left: 0,
    right: 0,
    height: 8,
  },
  mapLabelContainer: {
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  mapLabelBg: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  mapLabelText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  marker: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -22,
    marginTop: -22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 5,
  },
  markerCount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  legend: {
    position: "absolute",
    bottom: 80,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

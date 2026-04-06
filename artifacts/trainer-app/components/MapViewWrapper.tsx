import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GYMS, type Gym } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface Props {
  selectedGym: Gym | null;
  onGymPress: (gym: Gym) => void;
}

export function MapViewWrapper({ selectedGym, onGymPress }: Props) {
  const colors = useColors();

  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: -23.5618,
        longitude: -46.6648,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
      showsUserLocation
      showsMyLocationButton={false}
    >
      {GYMS.map((gym) => (
        <Marker
          key={gym.id}
          coordinate={{ latitude: gym.lat, longitude: gym.lng }}
          onPress={() => onGymPress(gym)}
        >
          <View style={styles.markerContainer}>
            <View
              style={[
                styles.marker,
                {
                  backgroundColor:
                    selectedGym?.id === gym.id ? colors.darkSurface : colors.primary,
                  borderColor: "#FFFFFF",
                },
              ]}
            >
              <Text style={styles.markerCount}>{gym.availableTrainers}</Text>
            </View>
            <View
              style={[
                styles.markerTail,
                {
                  borderTopColor:
                    selectedGym?.id === gym.id ? colors.darkSurface : colors.primary,
                },
              ]}
            />
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  markerContainer: { alignItems: "center" },
  marker: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  markerCount: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
  },
});

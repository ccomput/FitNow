import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function BookingSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();
  const booking = bookings[0];

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(cardY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad + 24 },
      ]}
    >
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.successCircle,
            { backgroundColor: colors.success },
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          <Feather name="check" size={48} color="#FFFFFF" />
        </Animated.View>

        <Animated.View style={{ opacity: opacityAnim, alignItems: "center", gap: 8 }}>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>
            Reserva confirmada!
          </Text>
          <Text style={[styles.successSubtitle, { color: colors.mutedForeground }]}>
            Seu treino foi agendado com sucesso
          </Text>
        </Animated.View>

        {booking && (
          <Animated.View
            style={[
              styles.bookingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                transform: [{ translateY: cardY }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.cardBadgeText}>Confirmado</Text>
              </View>
              <Text style={[styles.cardId, { color: colors.mutedForeground }]}>
                #{booking.id.slice(-6).toUpperCase()}
              </Text>
            </View>

            <View style={styles.cardDivider} />

            <BookingDetail
              icon="user"
              label="Personal"
              value={booking.trainerName}
              colors={colors}
            />
            <BookingDetail
              icon="map-pin"
              label="Local"
              value={booking.gymName}
              colors={colors}
            />
            <BookingDetail
              icon="calendar"
              label="Data"
              value={formatDate(booking.date)}
              colors={colors}
            />
            <BookingDetail
              icon="clock"
              label="Horário"
              value={booking.time}
              colors={colors}
            />
            <BookingDetail
              icon="activity"
              label="Treino"
              value={booking.type}
              colors={colors}
            />

            <View style={[styles.cardDivider, { marginVertical: 8 }]} />

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>
                Total pago
              </Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                R$ {booking.price}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={styles.actionsCol}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace("/(tabs)/")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Voltar ao início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: colors.border }]}
          onPress={() => router.replace("/(tabs)/bookings")}
          activeOpacity={0.8}
        >
          <Feather name="calendar" size={16} color={colors.foreground} />
          <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>
            Ver meus agendamentos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BookingDetail({
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
      <Feather name={icon as any} size={15} color={colors.mutedForeground} />
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

function formatDate(date: string) {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, justifyContent: "space-between" },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  successSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  bookingCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  cardBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  cardId: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  detailLabel: { fontSize: 13, fontFamily: "Inter_400Regular", width: 70 },
  detailValue: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1, textAlign: "right" },
  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  totalLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  totalValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  actionsCol: { gap: 12 },
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});

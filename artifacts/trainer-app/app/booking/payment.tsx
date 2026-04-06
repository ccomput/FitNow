import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { TRAINERS, GYMS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import type { Booking } from "@/data/mockData";

const PAYMENT_METHODS = [
  { id: "pix", label: "PIX", icon: "zap", desc: "Pagamento instantâneo" },
  { id: "credit", label: "Cartão de crédito", icon: "credit-card", desc: "Em até 12x" },
  { id: "debit", label: "Cartão de débito", icon: "credit-card", desc: "À vista" },
];

export default function PaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trainerId, gymId, slot, duration, total } = useLocalSearchParams<{
    trainerId: string;
    gymId: string;
    slot: string;
    duration: string;
    total: string;
  }>();
  const { filters, addBooking } = useApp();

  const trainer = TRAINERS.find((t) => t.id === trainerId);
  const gym = GYMS.find((g) => g.id === gymId);

  const [selectedMethod, setSelectedMethod] = useState("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!trainer || !gym) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newBooking: Booking = {
        id: Date.now().toString(),
        trainerId: trainer.id,
        trainerName: trainer.name,
        gymName: gym.name,
        gymAddress: gym.address,
        date: filters.date,
        time: slot,
        type: filters.trainingType,
        price: Number(total),
        status: "confirmed",
        imageKey: trainer.imageKey,
      };
      addBooking(newBooking);
      setIsProcessing(false);
      router.replace({
        pathname: "/booking/success",
        params: { bookingId: newBooking.id },
      });
    }, 1800);
  };

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
          Pagamento
        </Text>
        <View style={[styles.secureBadge, { backgroundColor: colors.secondary }]}>
          <Feather name="lock" size={11} color={colors.mutedForeground} />
          <Text style={[styles.secureText, { color: colors.mutedForeground }]}>
            Seguro
          </Text>
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
        <View style={[styles.totalCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalAmount}>R$ {total}</Text>
          <Text style={styles.totalDesc}>
            {trainer.name} · {slot} · {duration} min
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Método de pagamento
          </Text>
          <View style={styles.methodsCol}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.methodIcon,
                      { backgroundColor: isSelected ? colors.primary : colors.secondary },
                    ]}
                  >
                    <Feather
                      name={method.icon as any}
                      size={16}
                      color={isSelected ? "#FFFFFF" : colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodLabel, { color: colors.foreground }]}>
                      {method.label}
                    </Text>
                    <Text style={[styles.methodDesc, { color: colors.mutedForeground }]}>
                      {method.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: isSelected ? colors.primary : colors.border },
                    ]}
                  >
                    {isSelected && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {(selectedMethod === "credit" || selectedMethod === "debit") && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Dados do cartão
            </Text>
            <View style={styles.cardForm}>
              <View
                style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.card }]}
              >
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  Número do cartão
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
              <View
                style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.card }]}
              >
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  Nome no cartão
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="NOME SOBRENOME"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.inputWrapper,
                    { borderColor: colors.border, backgroundColor: colors.card, flex: 1 },
                  ]}
                >
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                    Validade
                  </Text>
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    placeholder="MM/AA"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View
                  style={[
                    styles.inputWrapper,
                    { borderColor: colors.border, backgroundColor: colors.card, flex: 1 },
                  ]}
                >
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                    CVV
                  </Text>
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    placeholder="123"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {selectedMethod === "pix" && (
          <View style={[styles.pixInfo, { backgroundColor: colors.secondary }]}>
            <View style={[styles.pixIconBg, { backgroundColor: colors.primary }]}>
              <Feather name="zap" size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.pixTitle, { color: colors.foreground }]}>
              Pagamento via PIX
            </Text>
            <Text style={[styles.pixDesc, { color: colors.mutedForeground }]}>
              Você será direcionado para escanear o QR Code após confirmar. O agendamento é confirmado instantaneamente.
            </Text>
          </View>
        )}
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
          style={[
            styles.payBtn,
            {
              backgroundColor: isProcessing ? colors.muted : colors.primary,
            },
          ]}
          onPress={handlePay}
          activeOpacity={0.85}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={[styles.payBtnText, { color: colors.mutedForeground }]}>
              Processando...
            </Text>
          ) : (
            <>
              <Feather name="check-circle" size={18} color="#FFFFFF" />
              <Text style={styles.payBtnText}>Pagar R$ {total}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", flex: 1 },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  secureText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 24 },
  totalCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },
  totalLabel: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter_400Regular" },
  totalAmount: { color: "#FFFFFF", fontSize: 36, fontFamily: "Inter_700Bold" },
  totalDesc: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter_400Regular" },
  section: { gap: 14 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  methodsCol: { gap: 10 },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  methodDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  cardForm: { gap: 12 },
  cardRow: { flexDirection: "row", gap: 12 },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  inputLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  input: { fontSize: 15, fontFamily: "Inter_500Medium", paddingVertical: 0 },
  pixInfo: {
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  pixIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  pixTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  pixDesc: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
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

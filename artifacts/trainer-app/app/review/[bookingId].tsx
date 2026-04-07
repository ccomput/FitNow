import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { TRAINERS } from "@/data/mockData";
import { TrainerImage } from "@/components/TrainerImage";

export default function ReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();

  const booking = bookings.find((b) => b.status === "completed") ?? bookings[0];
  const trainer = TRAINERS.find((t) => t.id === booking?.trainerId) ?? TRAINERS[0];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSubmit = () => {
    setDone(true);
    setTimeout(() => router.back(), 2000);
  };

  if (done) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.successScreen}>
          <View style={[styles.successCircle, { backgroundColor: "#F59E0B" }]}>
            <Feather name="star" size={36} color="#FFFFFF" />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Avaliação enviada!</Text>
          <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
            Obrigado pelo seu feedback. Ele ajuda outros alunos a escolherem o personal certo.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Avaliar personal</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.trainerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {trainer && <TrainerImage imageKey={trainer.imageKey} style={styles.trainerPhoto} />}
          <View>
            <Text style={[styles.trainerName, { color: colors.foreground }]}>{trainer?.name}</Text>
            <Text style={[styles.trainerSpec, { color: colors.mutedForeground }]}>
              {trainer?.specialty.slice(0, 2).join(" · ")}
            </Text>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={[styles.ratingTitle, { color: colors.foreground }]}>Qual nota você dá?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Feather
                  name={star <= rating ? "star" : "star"}
                  size={44}
                  color={star <= rating ? "#F59E0B" : colors.muted}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.ratingLabel, { color: colors.mutedForeground }]}>
            {rating === 0 ? "Toque para avaliar" : ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente!"][rating]}
          </Text>
        </View>

        <View style={styles.commentSection}>
          <Text style={[styles.commentTitle, { color: colors.foreground }]}>Deixe um comentário</Text>
          <TextInput
            style={[styles.commentInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            value={comment}
            onChangeText={setComment}
            placeholder="Como foi a experiência? O personal te ajudou a atingir seus objetivos?"
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={[styles.privacyBanner, { backgroundColor: colors.secondary }]}>
          <Feather name="eye" size={13} color={colors.mutedForeground} />
          <Text style={[styles.privacyText, { color: colors.mutedForeground }]}>
            Sua avaliação será exibida no perfil público do personal.
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: rating > 0 ? colors.primary : colors.muted }]}
          onPress={handleSubmit}
          disabled={rating === 0}
          activeOpacity={0.85}
        >
          <Feather name="send" size={16} color={rating > 0 ? "#FFFFFF" : colors.mutedForeground} />
          <Text style={[styles.submitBtnText, { color: rating > 0 ? "#FFFFFF" : colors.mutedForeground }]}>
            Enviar avaliação
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { flex: 1, paddingHorizontal: 20, gap: 28 },
  trainerCard: { flexDirection: "row", gap: 16, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: "center" },
  trainerPhoto: { width: 60, height: 72, borderRadius: 12, resizeMode: "cover" },
  trainerName: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  trainerSpec: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  ratingSection: { alignItems: "center", gap: 14 },
  ratingTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  starsRow: { flexDirection: "row", gap: 8 },
  ratingLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  commentSection: { gap: 10 },
  commentTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  commentInput: {
    borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 14,
    fontFamily: "Inter_400Regular", minHeight: 110, textAlignVertical: "top",
  },
  privacyBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10 },
  privacyText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  submitBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  successScreen: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 32 },
  successCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  successSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
});

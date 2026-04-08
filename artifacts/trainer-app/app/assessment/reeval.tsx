import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const INCLUDES = [
  { icon: "bar-chart-2", title: "Revisão do progresso", desc: "Comparação com avaliação anterior e resultados alcançados" },
  { icon: "edit-2", title: "Atualização do treino", desc: "Ajuste de carga, volume e divisão conforme evolução" },
  { icon: "target", title: "Ajuste de estratégia", desc: "Revisão do objetivo e redirecionamento se necessário" },
  { icon: "activity", title: "Nova avaliação física", desc: "Medidas atualizadas e composição corporal atual" },
  { icon: "calendar", title: "Nova recomendação", desc: "Frequência e intensidade ajustadas ao novo momento" },
];

export default function ReevalInfoScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Reavaliação</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: colors.darkSurface }]}>
          <View style={styles.heroBadge}>
            <Feather name="refresh-cw" size={14} color="#10B981" />
            <Text style={styles.heroBadgeText}>ACOMPANHAMENTO CONTÍNUO</Text>
          </View>
          <Text style={styles.heroTitle}>Mantenha sua{"\n"}evolução em dia</Text>
          <Text style={styles.heroSub}>
            O corpo se adapta. Seu treino também precisa evoluir. A reavaliação garante que seu plano continue desafiador, seguro e alinhado com seus objetivos atuais.
          </Text>
        </View>

        <View style={[styles.alertCard, { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" }]}>
          <View style={styles.alertHeader}>
            <View style={[styles.alertIcon, { backgroundColor: "#FEF3C7" }]}>
              <Feather name="bell" size={16} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: "#92400E" }]}>Reavaliação recomendada</Text>
              <Text style={[styles.alertSub, { color: "#B45309" }]}>Sugerida em 15 de julho de 2026</Text>
            </View>
          </View>
          <Text style={[styles.alertDesc, { color: "#78350F" }]}>
            Com base na sua última avaliação (07/04/2026), seu próximo ponto de controle está próximo. Não perca a oportunidade de ajustar sua rota.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>O que a reavaliação inclui</Text>

        <View style={styles.includesList}>
          {INCLUDES.map((item, i) => (
            <View key={i} style={[styles.includeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.includeIcon, { backgroundColor: "#ECFDF5" }]}>
                <Feather name={item.icon as any} size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.includeTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.includeDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.frequencyCard, { backgroundColor: colors.secondary }]}>
          <Feather name="info" size={15} color={colors.mutedForeground} />
          <Text style={[styles.frequencyText, { color: colors.mutedForeground }]}>
            Recomendamos reavaliação a cada 3 meses ou sempre que você mudar de objetivo, personal ou intensidade de treino.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.scheduleBtn, { backgroundColor: "#10B981" }]}
          onPress={() => router.push("/(tabs)/")}
          activeOpacity={0.85}
        >
          <Feather name="calendar" size={18} color="#FFFFFF" />
          <Text style={styles.scheduleBtnText}>Agendar reavaliação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  scroll: { paddingHorizontal: 16, gap: 20 },
  heroCard: { borderRadius: 20, padding: 24, gap: 12 },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: "rgba(16,185,129,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroBadgeText: { color: "#10B981", fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  heroTitle: { color: "#FFFFFF", fontSize: 26, fontFamily: "Inter_700Bold", lineHeight: 32 },
  heroSub: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  alertCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  alertHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  alertIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  alertTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  alertSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  alertDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  sectionLabel: { fontSize: 17, fontFamily: "Inter_700Bold" },
  includesList: { gap: 10 },
  includeCard: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  includeIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  includeTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  includeDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  frequencyCard: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, alignItems: "flex-start" },
  frequencyText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  scheduleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  scheduleBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

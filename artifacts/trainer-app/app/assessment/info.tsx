import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const INCLUDES = [
  { icon: "file-text", title: "Anamnese completa", desc: "Histórico de saúde, rotina, experiência e preferências" },
  { icon: "activity", title: "Avaliação física inicial", desc: "Medidas, composição corporal e análise postural" },
  { icon: "target", title: "Definição de objetivo", desc: "Clareza sobre metas e expectativas realistas" },
  { icon: "alert-triangle", title: "Análise de restrições", desc: "Lesões, condições de saúde e limitações" },
  { icon: "list", title: "Criação do treino inicial", desc: "Treino personalizado pronto para começar" },
  { icon: "calendar", title: "Recomendação de frequência", desc: "Quantas sessões por semana para atingir seu objetivo" },
];

const STEPS = [
  { num: "01", label: "Você agenda com o personal" },
  { num: "02", label: "Na sessão, o personal faz sua anamnese" },
  { num: "03", label: "Avaliação física é registrada no app" },
  { num: "04", label: "Seu treino inicial é criado e salvo" },
  { num: "05", label: "Você recebe o plano e começa a evoluir" },
];

export default function AssessmentInfoScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Avaliação + Aula Inicial</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: colors.darkSurface }]}>
          <View style={styles.heroBadge}>
            <Feather name="award" size={14} color="#FF5A1F" />
            <Text style={styles.heroBadgeText}>SERVIÇO PREMIUM</Text>
          </View>
          <Text style={styles.heroTitle}>Comece com{"\n"}segurança e direção</Text>
          <Text style={styles.heroSub}>
            Na sua primeira sessão, o personal faz uma avaliação completa e cria seu treino personalizado. Você começa com clareza total sobre onde está e para onde vai.
          </Text>
          <View style={styles.heroDuration}>
            <Feather name="clock" size={14} color="rgba(255,255,255,0.5)" />
            <Text style={styles.heroDurationText}>Sessão de 90 minutos · 1x</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>O que está incluído</Text>

        <View style={styles.includesList}>
          {INCLUDES.map((item, i) => (
            <View key={i} style={[styles.includeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.includeIcon, { backgroundColor: colors.accent }]}>
                <Feather name={item.icon as any} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.includeTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.includeDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Como funciona</Text>

        <View style={[styles.stepsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: i === 0 ? colors.primary : colors.secondary }]}>
                <Text style={[styles.stepNumText, { color: i === 0 ? "#FFFFFF" : colors.mutedForeground }]}>{s.num}</Text>
              </View>
              <Text style={[styles.stepLabel, { color: colors.foreground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.reavaliationCard, { backgroundColor: colors.secondary }]}>
          <View style={styles.reavaliationHeader}>
            <Feather name="refresh-cw" size={16} color={colors.primary} />
            <Text style={[styles.reavaliationTitle, { color: colors.foreground }]}>E depois?</Text>
          </View>
          <Text style={[styles.reavaliationText, { color: colors.mutedForeground }]}>
            Após algumas semanas, o app vai alertar quando for hora da sua reavaliação. Esse processo mantém seu treino sempre ajustado ao seu progresso.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/assessment/reeval")}
            style={styles.reavaliationLink}
            activeOpacity={0.7}
          >
            <Text style={[styles.reavaliationLinkText, { color: colors.primary }]}>Saiba mais sobre reavaliação</Text>
            <Feather name="chevron-right" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={[styles.scheduleBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/")}
          activeOpacity={0.85}
        >
          <Feather name="calendar" size={18} color="#FFFFFF" />
          <Text style={styles.scheduleBtnText}>Agendar avaliação + aula</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 16, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  scroll: { paddingHorizontal: 16, gap: 20 },
  heroCard: { borderRadius: 20, padding: 24, gap: 12 },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: "rgba(255,90,31,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroBadgeText: { color: "#FF5A1F", fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  heroTitle: { color: "#FFFFFF", fontSize: 26, fontFamily: "Inter_700Bold", lineHeight: 32 },
  heroSub: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  heroDuration: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  heroDurationText: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionLabel: { fontSize: 17, fontFamily: "Inter_700Bold" },
  includesList: { gap: 10 },
  includeCard: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  includeIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  includeTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  includeDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  stepsCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  stepNum: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stepNumText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  stepLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  reavaliationCard: { borderRadius: 16, padding: 16, gap: 10 },
  reavaliationHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  reavaliationTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  reavaliationText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  reavaliationLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  reavaliationLinkText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  scheduleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  scheduleBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

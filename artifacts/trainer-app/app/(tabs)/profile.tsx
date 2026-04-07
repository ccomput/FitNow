import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookings, studentProfile, notifications } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const completed = bookings.filter((b) => b.status === "completed").length;
  const unread = notifications.filter((n) => !n.read).length;

  const MY_ITEMS = [
    { icon: "file-text", label: "Minha ficha", route: "/student/ficha", color: "#3B82F6" },
    { icon: "trending-up", label: "Minha evolução", route: "/student/evolution", color: "#10B981" },
    { icon: "star", label: "Avaliar personal", route: "/review/last", color: "#F59E0B" },
  ];

  const MENU_ITEMS = [
    { icon: "bell", label: "Notificações", route: "/student/notifications", badge: unread },
    { icon: "credit-card", label: "Formas de pagamento" },
    { icon: "shield", label: "Privacidade e segurança" },
    { icon: "help-circle", label: "Central de ajuda" },
    { icon: "info", label: "Sobre o FitNow" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarLargeText}>{studentProfile.name?.[0] ?? "V"}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>
              {studentProfile.name}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>
              {studentProfile.email}
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.levelBadgeText, { color: colors.primary }]}>
                {studentProfile.level}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.editBtn, { borderColor: colors.border }]}
            onPress={() => router.push("/student/ficha")}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={15} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{bookings.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Sessões</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{completed}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Concluídas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>4.8</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Sua nota</Text>
          </View>
        </View>

        <View style={[styles.goalCard, { backgroundColor: colors.darkSurface }]}>
          <Feather name="target" size={16} color="#FF5A1F" />
          <View style={{ flex: 1 }}>
            <Text style={styles.goalCardLabel}>Objetivo atual</Text>
            <Text style={styles.goalCardValue}>{studentProfile.goal}</Text>
          </View>
          <Text style={styles.goalCardFreq}>{studentProfile.weeklyFrequency}</Text>
        </View>

        <View style={styles.sectionLabel}>
          <Text style={[styles.sectionLabelText, { color: colors.mutedForeground }]}>MINHA CONTA</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {MY_ITEMS.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                  <Feather name={item.icon as any} size={17} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
              {index < MY_ITEMS.length - 1 && (
                <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.sectionLabel}>
          <Text style={[styles.sectionLabelText, { color: colors.mutedForeground }]}>CONFIGURAÇÕES</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {MENU_ITEMS.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.route ? () => router.push(item.route as any) : undefined}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name={item.icon as any} size={17} color={colors.foreground} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                {item.badge && item.badge > 0 ? (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                ) : null}
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
              {index < MENU_ITEMS.length - 1 && (
                <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.switchBtn, { borderColor: colors.border }]}
          onPress={() => router.replace("/profile-select")}
          activeOpacity={0.7}
        >
          <Feather name="repeat" size={16} color={colors.mutedForeground} />
          <Text style={[styles.switchBtnText, { color: colors.mutedForeground }]}>
            Mudar para conta de personal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={16} color="#EF4444" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>FitNow v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 14 },
  profileCard: {
    flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 18, borderWidth: 1,
  },
  avatarLarge: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  avatarLargeText: { color: "#FFFFFF", fontSize: 24, fontFamily: "Inter_700Bold" },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  profileEmail: { fontSize: 13, fontFamily: "Inter_400Regular" },
  levelBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  levelBadgeText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  editBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 24, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  goalCard: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14,
  },
  goalCardLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Inter_400Regular" },
  goalCardValue: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  goalCardFreq: { color: "#FF5A1F", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionLabel: { paddingHorizontal: 4, marginBottom: -4 },
  sectionLabelText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  section: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  menuDivider: { height: StyleSheet.hairlineWidth, marginLeft: 66 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, marginRight: 4 },
  badgeText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Inter_700Bold" },
  switchBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 13, borderRadius: 14, borderWidth: 1,
  },
  switchBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1,
  },
  logoutText: { color: "#EF4444", fontSize: 15, fontFamily: "Inter_500Medium" },
  version: { textAlign: "center", fontSize: 12, fontFamily: "Inter_400Regular" },
});

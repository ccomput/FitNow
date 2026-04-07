import React from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const TYPE_CONFIG = {
  booking: { icon: "calendar", color: "#FF5A1F", bg: "#FFF0EB" },
  reminder: { icon: "bell", color: "#F59E0B", bg: "#FFFBEB" },
  update: { icon: "refresh-cw", color: "#3B82F6", bg: "#EFF6FF" },
  change: { icon: "alert-circle", color: "#EF4444", bg: "#FEF2F2" },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notificações</Text>
          {unread > 0 && (
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{unread} não lidas</Text>
          )}
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        renderItem={({ item: n }) => {
          const cfg = TYPE_CONFIG[n.type];
          return (
            <TouchableOpacity
              style={[
                styles.notifCard,
                {
                  backgroundColor: n.read ? colors.card : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => markNotificationRead(n.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
                <Feather name={cfg.icon as any} size={18} color={cfg.color} />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTitleRow}>
                  <Text style={[styles.notifTitle, { color: colors.foreground }]}>{n.title}</Text>
                  {!n.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.notifBody, { color: colors.mutedForeground }]}>{n.body}</Text>
                <Text style={[styles.notifTime, { color: colors.muted }]}>{n.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="bell-off" size={40} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhuma notificação</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  list: { paddingHorizontal: 16 },
  notifCard: {
    flexDirection: "row", gap: 14, padding: 14, borderRadius: 16, borderWidth: 1,
  },
  notifIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  notifContent: { flex: 1, gap: 4 },
  notifTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  notifTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  notifTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", gap: 12, paddingTop: 80 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});

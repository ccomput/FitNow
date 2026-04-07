import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DATES = [7, 8, 9, 10, 11, 12];
const TODAY_IDX = 3;

const AGENDA: Record<number, { time: string; student: string; type: string; status: "confirmed" | "free" | "blocked" }[]> = {
  0: [
    { time: "07:00", student: "Ana Lima", type: "Funcional", status: "confirmed" },
    { time: "08:00", student: "", type: "", status: "free" },
    { time: "09:00", student: "Pedro Costa", type: "Musculação", status: "confirmed" },
    { time: "10:00", student: "", type: "", status: "blocked" },
  ],
  1: [
    { time: "07:00", student: "", type: "", status: "free" },
    { time: "08:00", student: "Julia Faria", type: "Yoga", status: "confirmed" },
    { time: "17:00", student: "Rodrigo M.", type: "Hipertrofia", status: "confirmed" },
  ],
  2: [
    { time: "06:00", student: "Carlos A.", type: "HIIT", status: "confirmed" },
    { time: "08:00", student: "", type: "", status: "free" },
    { time: "09:00", student: "Beatriz S.", type: "Pilates", status: "confirmed" },
    { time: "18:00", student: "", type: "", status: "free" },
  ],
  3: [
    { time: "07:00", student: "Victor Santos", type: "Hipertrofia", status: "confirmed" },
    { time: "08:00", student: "", type: "", status: "free" },
    { time: "09:00", student: "", type: "", status: "free" },
    { time: "16:00", student: "Mariana K.", type: "Emagrecimento", status: "confirmed" },
    { time: "17:00", student: "", type: "", status: "blocked" },
  ],
  4: [
    { time: "07:00", student: "Lucas R.", type: "Musculação", status: "confirmed" },
    { time: "10:00", student: "", type: "", status: "free" },
    { time: "11:00", student: "Tânia M.", type: "Mobilidade", status: "confirmed" },
  ],
  5: [
    { time: "09:00", student: "", type: "", status: "free" },
    { time: "10:00", student: "Felipe D.", type: "CrossFit", status: "confirmed" },
  ],
};

const STATUS_STYLES = {
  confirmed: { bg: "#ECFDF5", text: "#059669", label: "Confirmado" },
  free: { bg: "#F0F9FF", text: "#0EA5E9", label: "Livre" },
  blocked: { bg: "#FFF1F2", text: "#E11D48", label: "Bloqueado" },
};

export default function PersonalAgendaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeDay, setActiveDay] = useState(TODAY_IDX);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const slots = AGENDA[activeDay] ?? [];
  const confirmed = slots.filter((s) => s.status === "confirmed").length;
  const free = slots.filter((s) => s.status === "free").length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Minha agenda</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Abril 2026</Text>
        </View>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: "#10B981" }]} activeOpacity={0.8}>
          <Feather name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
        {DAYS.map((day, i) => {
          const isActive = i === activeDay;
          const isToday = i === TODAY_IDX;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveDay(i)}
              style={[
                styles.dayCard,
                {
                  backgroundColor: isActive ? "#1A1A2E" : colors.card,
                  borderColor: isActive ? "#1A1A2E" : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayName, { color: isActive ? "rgba(255,255,255,0.6)" : colors.mutedForeground }]}>{day}</Text>
              <Text style={[styles.dayDate, { color: isActive ? "#FFFFFF" : colors.foreground }]}>{DATES[i]}</Text>
              {isToday && <View style={[styles.todayDot, { backgroundColor: isActive ? "#FF5A1F" : "#FF5A1F" }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: "#10B981" }]}>{confirmed}</Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Confirmados</Text>
        </View>
        <View style={[styles.summaryDiv, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: "#0EA5E9" }]}>{free}</Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Horários livres</Text>
        </View>
        <View style={[styles.summaryDiv, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: colors.foreground }]}>{slots.length}</Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.agendaList, { paddingBottom: bottomPad + 80 }]} showsVerticalScrollIndicator={false}>
        {slots.map((slot, i) => {
          const st = STATUS_STYLES[slot.status];
          return (
            <View key={i} style={styles.slotRow}>
              <Text style={[styles.slotTime, { color: colors.mutedForeground }]}>{slot.time}</Text>
              <View
                style={[
                  styles.slotCard,
                  {
                    backgroundColor: slot.status === "confirmed" ? colors.card : `${st.bg}`,
                    borderColor: colors.border,
                    borderLeftColor: st.text,
                    borderLeftWidth: 3,
                  },
                ]}
              >
                {slot.status === "confirmed" ? (
                  <>
                    <View style={styles.slotCardTop}>
                      <Text style={[styles.slotStudent, { color: colors.foreground }]}>{slot.student}</Text>
                      <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                        <Text style={[styles.statusPillText, { color: st.text }]}>{st.label}</Text>
                      </View>
                    </View>
                    <Text style={[styles.slotType, { color: colors.mutedForeground }]}>{slot.type}</Text>
                  </>
                ) : (
                  <Text style={[styles.slotEmptyLabel, { color: st.text }]}>{st.label}</Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  daysRow: { paddingHorizontal: 16, gap: 10, paddingBottom: 16 },
  dayCard: { width: 60, paddingVertical: 12, borderRadius: 14, borderWidth: 1, alignItems: "center", gap: 4 },
  dayName: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dayDate: { fontSize: 20, fontFamily: "Inter_700Bold" },
  todayDot: { width: 5, height: 5, borderRadius: 2.5 },
  summaryRow: { flexDirection: "row", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryVal: { fontSize: 22, fontFamily: "Inter_700Bold" },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  summaryDiv: { width: 1, height: "100%" },
  agendaList: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  slotRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  slotTime: { width: 44, fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "right" },
  slotCard: {
    flex: 1, padding: 12, borderRadius: 12, borderWidth: 1,
    borderLeftWidth: 3, gap: 4,
  },
  slotCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  slotStudent: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusPillText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  slotType: { fontSize: 12, fontFamily: "Inter_400Regular" },
  slotEmptyLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
});

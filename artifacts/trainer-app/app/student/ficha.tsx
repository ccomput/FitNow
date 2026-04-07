import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function StudentFichaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { studentProfile, setStudentProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...studentProfile });

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = () => {
    setStudentProfile(draft);
    setEditing(false);
  };

  const val = editing ? draft : studentProfile;

  const sections = [
    {
      title: "Dados pessoais",
      icon: "user",
      fields: [
        { label: "Nome", key: "name" },
        { label: "E-mail", key: "email" },
        { label: "Telefone", key: "phone" },
        { label: "Data de nascimento", key: "birthDate" },
        { label: "Sexo", key: "gender" },
      ],
    },
    {
      title: "Dados físicos",
      icon: "activity",
      fields: [
        { label: "Altura (cm)", key: "height" },
        { label: "Peso (kg)", key: "weight" },
        { label: "Nível de treino", key: "level" },
        { label: "Frequência semanal", key: "weeklyFrequency" },
      ],
    },
    {
      title: "Objetivo",
      icon: "target",
      fields: [{ label: "Objetivo principal", key: "goal" }],
    },
    {
      title: "Saúde",
      icon: "heart",
      fields: [
        { label: "Restrições físicas", key: "restrictions" },
        { label: "Lesões", key: "injuries" },
        { label: "Condições de saúde", key: "healthConditions" },
        { label: "Medicações", key: "medications" },
        { label: "Observações", key: "observations" },
        { label: "Contato de emergência", key: "emergencyContact" },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Minha ficha</Text>
        <TouchableOpacity
          onPress={editing ? handleSave : () => setEditing(true)}
          style={[styles.editBtn, { backgroundColor: editing ? colors.primary : colors.secondary }]}
          activeOpacity={0.7}
        >
          <Feather name={editing ? "check" : "edit-2"} size={15} color={editing ? "#FFFFFF" : colors.foreground} />
          <Text style={[styles.editBtnText, { color: editing ? "#FFFFFF" : colors.foreground }]}>
            {editing ? "Salvar" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.avatarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{val.name?.[0] ?? "V"}</Text>
          </View>
          <View>
            <Text style={[styles.avatarName, { color: colors.foreground }]}>{val.name}</Text>
            <Text style={[styles.avatarEmail, { color: colors.mutedForeground }]}>{val.email}</Text>
          </View>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.accent }]}>
                <Feather name={section.icon as any} size={15} color={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
            </View>
            {section.fields.map((field) => (
              <View key={field.key} style={styles.fieldRow}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
                {editing ? (
                  <TextInput
                    style={[styles.fieldInput, { color: colors.foreground, borderColor: colors.border }]}
                    value={(draft as any)[field.key]}
                    onChangeText={(t) => setDraft((d) => ({ ...d, [field.key]: t }))}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.foreground }]}>
                    {(val as any)[field.key] || "—"}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontFamily: "Inter_600SemiBold" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  editBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  scroll: { paddingHorizontal: 16, gap: 14 },
  avatarCard: { flexDirection: "row", alignItems: "center", gap: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontSize: 22, fontFamily: "Inter_700Bold" },
  avatarName: { fontSize: 17, fontFamily: "Inter_700Bold" },
  avatarEmail: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E5E7EB" },
  sectionIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  fieldRow: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#F3F4F6", gap: 4 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  fieldValue: { fontSize: 14, fontFamily: "Inter_400Regular" },
  fieldInput: { fontSize: 14, fontFamily: "Inter_400Regular", borderBottomWidth: 1, paddingVertical: 2 },
});

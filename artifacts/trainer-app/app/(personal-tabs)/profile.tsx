import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { TrainerImage } from "@/components/TrainerImage";

const SPECIALTIES_LIST = ["Musculação", "Funcional", "CrossFit", "Yoga", "Pilates", "HIIT", "Corrida", "Lutas"];

export default function PersonalProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("Carlos Mendes");
  const [bio, setBio] = useState("Especialista em transformação corporal com 8 anos de experiência. Formado em Educação Física pela USP, com especialização em Fisiologia do Exercício.");
  const [cref, setCref] = useState("CREF 123456-G/SP");
  const [experience, setExperience] = useState("8");
  const [price, setPrice] = useState("180");
  const [specialties, setSpecialties] = useState(["Hipertrofia", "Emagrecimento", "Funcional"]);
  const [certifications, setCertifications] = useState("CREF, CrossFit L2, Nutrição Esportiva");
  const [academies, setAcademies] = useState("SmartFit Centro, SmartFit Paulista");
  const [regions, setRegions] = useState("Bela Vista, Jardins, Paraíso");
  const [modalities, setModalities] = useState<string[]>(["Presencial"]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const toggleSpecialty = (s: string) => {
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleModality = (m: string) => {
    setModalities((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Meu perfil</Text>
        <TouchableOpacity
          onPress={() => setEditing(!editing)}
          style={[styles.editBtn, { backgroundColor: editing ? "#10B981" : colors.secondary }]}
          activeOpacity={0.7}
        >
          <Feather name={editing ? "check" : "edit-2"} size={15} color={editing ? "#FFFFFF" : colors.foreground} />
          <Text style={[styles.editBtnText, { color: editing ? "#FFFFFF" : colors.foreground }]}>
            {editing ? "Salvar" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 80 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: colors.darkSurface }]}>
          <View style={styles.heroRow}>
            <TrainerImage imageKey="trainer1" style={styles.heroPhoto} />
            <View style={styles.heroInfo}>
              {editing ? (
                <TextInput
                  style={[styles.heroNameInput, { borderBottomColor: "rgba(255,255,255,0.3)" }]}
                  value={name}
                  onChangeText={setName}
                />
              ) : (
                <Text style={styles.heroName}>{name}</Text>
              )}
              <Text style={styles.heroCref}>{cref}</Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatVal}>4.9</Text>
                  <Text style={styles.heroStatLabel}>rating</Text>
                </View>
                <View style={styles.heroStatDiv} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatVal}>{experience}a</Text>
                  <Text style={styles.heroStatLabel}>exp.</Text>
                </View>
                <View style={styles.heroStatDiv} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatVal}>127</Text>
                  <Text style={styles.heroStatLabel}>alunos</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader icon="file-text" title="Bio" colors={colors} />
          {editing ? (
            <TextInput
              style={[styles.editArea, { color: colors.foreground, borderColor: colors.border }]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={[styles.bioText, { color: colors.mutedForeground }]}>{bio}</Text>
          )}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader icon="dollar-sign" title="Preço por sessão" colors={colors} />
          <View style={styles.priceRow}>
            <Text style={[styles.pricePrefix, { color: colors.mutedForeground }]}>R$</Text>
            {editing ? (
              <TextInput
                style={[styles.priceInput, { color: colors.primary, borderBottomColor: colors.border }]}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            ) : (
              <Text style={[styles.priceVal, { color: colors.primary }]}>{price}</Text>
            )}
            <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>/hora</Text>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader icon="activity" title="Especialidades" colors={colors} />
          <View style={styles.tagsWrap}>
            {editing
              ? SPECIALTIES_LIST.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => toggleSpecialty(s)}
                    style={[
                      styles.tagChip,
                      {
                        backgroundColor: specialties.includes(s) ? colors.accent : colors.secondary,
                        borderColor: specialties.includes(s) ? colors.primary : "transparent",
                        borderWidth: 1,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tagText, { color: specialties.includes(s) ? colors.primary : colors.mutedForeground }]}>{s}</Text>
                  </TouchableOpacity>
                ))
              : specialties.map((s) => (
                  <View key={s} style={[styles.tagChip, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.tagText, { color: colors.primary }]}>{s}</Text>
                  </View>
                ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader icon="video" title="Modalidades" colors={colors} />
          <View style={styles.modalityRow}>
            {["Presencial", "Online"].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={editing ? () => toggleModality(m) : undefined}
                style={[
                  styles.modalityBtn,
                  {
                    backgroundColor: modalities.includes(m) ? colors.primary : colors.secondary,
                    borderColor: modalities.includes(m) ? colors.primary : colors.border,
                    flex: 1,
                  },
                ]}
                activeOpacity={editing ? 0.7 : 1}
              >
                <Feather name={m === "Presencial" ? "map-pin" : "video"} size={15} color={modalities.includes(m) ? "#FFFFFF" : colors.mutedForeground} />
                <Text style={[styles.modalityText, { color: modalities.includes(m) ? "#FFFFFF" : colors.foreground }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader icon="map-pin" title="Academias e regiões" colors={colors} />
          <EditableField label="Academias" value={academies} onChangeText={setAcademies} editing={editing} colors={colors} />
          <EditableField label="Regiões" value={regions} onChangeText={setRegions} editing={editing} colors={colors} />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader icon="award" title="Certificações" colors={colors} />
          <EditableField label="" value={certifications} onChangeText={setCertifications} editing={editing} colors={colors} />
        </View>

        <TouchableOpacity
          style={[styles.switchBtn, { borderColor: colors.border }]}
          onPress={() => router.replace("/profile-select")}
          activeOpacity={0.7}
        >
          <Feather name="repeat" size={16} color={colors.mutedForeground} />
          <Text style={[styles.switchBtnText, { color: colors.mutedForeground }]}>Mudar para conta de aluno</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ icon, title, colors }: { icon: string; title: string; colors: any }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={[styles.sectionIcon, { backgroundColor: colors.accent }]}>
        <Feather name={icon as any} size={14} color={colors.primary} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

function EditableField({ label, value, onChangeText, editing, colors }: any) {
  return (
    <View style={styles.editFieldBlock}>
      {label ? <Text style={[styles.editFieldLabel, { color: colors.mutedForeground }]}>{label}</Text> : null}
      {editing ? (
        <TextInput
          style={[styles.editFieldInput, { color: colors.foreground, borderColor: colors.border }]}
          value={value}
          onChangeText={onChangeText}
          multiline
        />
      ) : (
        <Text style={[styles.editFieldValue, { color: colors.mutedForeground }]}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  editBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  scroll: { paddingHorizontal: 16, gap: 14 },
  heroCard: { borderRadius: 20, padding: 20 },
  heroRow: { flexDirection: "row", gap: 16, alignItems: "flex-end" },
  heroPhoto: { width: 80, height: 96, borderRadius: 14, resizeMode: "cover" },
  heroInfo: { flex: 1, gap: 6 },
  heroName: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  heroNameInput: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold", borderBottomWidth: 1, paddingVertical: 2 },
  heroCref: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Inter_400Regular" },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 12 },
  heroStat: { alignItems: "center" },
  heroStatVal: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  heroStatLabel: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "Inter_400Regular" },
  heroStatDiv: { width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.15)" },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  bioText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  editArea: {
    borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 13,
    fontFamily: "Inter_400Regular", minHeight: 80, textAlignVertical: "top",
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  pricePrefix: { fontSize: 16, fontFamily: "Inter_500Medium" },
  priceVal: { fontSize: 32, fontFamily: "Inter_700Bold" },
  priceInput: { fontSize: 32, fontFamily: "Inter_700Bold", borderBottomWidth: 1, minWidth: 80 },
  priceUnit: { fontSize: 14, fontFamily: "Inter_400Regular" },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  modalityRow: { flexDirection: "row", gap: 10 },
  modalityBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
  },
  modalityText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  editFieldBlock: { gap: 4 },
  editFieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  editFieldValue: { fontSize: 13, fontFamily: "Inter_400Regular" },
  editFieldInput: { borderWidth: 1, borderRadius: 10, padding: 8, fontSize: 13, fontFamily: "Inter_400Regular" },
  switchBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1,
  },
  switchBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});

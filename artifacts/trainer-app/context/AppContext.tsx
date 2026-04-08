import React, { createContext, useContext, useState } from "react";
import { MOCK_BOOKINGS, Booking } from "@/data/mockData";

interface FilterState {
  date: string;
  time: string;
  mode: "Presencial" | "Online";
  trainingType: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  height: string;
  weight: string;
  goal: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  weeklyFrequency: string;
  restrictions: string;
  injuries: string;
  healthConditions: string;
  medications: string;
  observations: string;
  emergencyContact: string;
  onboardingComplete: boolean;
}

export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  obs?: string;
}

export interface WorkoutHistoryEntry {
  date: string;
  action: string;
  by: string;
  byType: "student" | "personal";
}

export interface Workout {
  id: string;
  name: string;
  focus: string;
  division: string;
  exercises: WorkoutExercise[];
  observations: string;
  updatedAt: string;
  origin: "student" | "personal_created" | "personal_adjusted";
  updatedBy: string;
  trainerName: string;
  history: WorkoutHistoryEntry[];
}

export interface EvolutionEntry {
  date: string;
  weight: number;
  bodyFat: number;
  leanMass: number;
  chest?: number;
  waist?: number;
  hips?: number;
  thigh?: number;
  arm?: number;
}

export interface Notification {
  id: string;
  type: "booking" | "reminder" | "update" | "change";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface AppContextType {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  selectedGymId: string | null;
  setSelectedGymId: (id: string | null) => void;
  viewMode: "map" | "list";
  setViewMode: (m: "map" | "list") => void;
  userType: "student" | "personal" | null;
  setUserType: (t: "student" | "personal" | null) => void;
  studentProfile: StudentProfile;
  setStudentProfile: (p: StudentProfile) => void;
  workout: Workout | null;
  setWorkout: (w: Workout | null) => void;
  evolution: EvolutionEntry[];
  addEvolution: (e: EvolutionEntry) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

const defaultStudentProfile: StudentProfile = {
  name: "Victor Santos",
  email: "victor@email.com",
  phone: "(11) 99999-8888",
  birthDate: "1995-06-15",
  gender: "Masculino",
  height: "178",
  weight: "80",
  goal: "Hipertrofia",
  level: "Intermediário",
  weeklyFrequency: "4x",
  restrictions: "Nenhuma",
  injuries: "Nenhuma",
  healthConditions: "Nenhuma",
  medications: "Nenhuma",
  observations: "Prefere treinos intensos, período manhã",
  emergencyContact: "Maria Santos (mãe) – (11) 98877-6655",
  onboardingComplete: true,
};

const defaultWorkout: Workout = {
  id: "w1",
  name: "Hipertrofia – Push/Pull/Legs",
  focus: "Hipertrofia",
  division: "Push / Pull / Legs (PPL)",
  exercises: [
    { name: "Supino Reto com Barra", sets: "4", reps: "8-10", obs: "Carga progressiva" },
    { name: "Supino Inclinado Halteres", sets: "3", reps: "10-12" },
    { name: "Crucifixo na Polia", sets: "3", reps: "12-15" },
    { name: "Desenvolvimento com Halteres", sets: "4", reps: "8-10" },
    { name: "Elevação Lateral", sets: "3", reps: "12-15" },
    { name: "Tríceps Pulley", sets: "3", reps: "12-15" },
  ],
  observations: "Descanso de 90s entre séries. Aumentar carga quando completar o topo das reps.",
  updatedAt: "2026-04-07",
  origin: "personal_adjusted",
  updatedBy: "Carlos Mendes",
  trainerName: "Carlos Mendes",
  history: [
    { date: "2026-01-15", action: "Treino informado pelo aluno", by: "Você", byType: "student" },
    { date: "2026-02-20", action: "Ajuste de carga e volume", by: "Carlos Mendes", byType: "personal" },
    { date: "2026-04-07", action: "Reestruturação com foco em hipertrofia", by: "Carlos Mendes", byType: "personal" },
  ],
};

const defaultEvolution: EvolutionEntry[] = [
  { date: "2026-01-10", weight: 84, bodyFat: 22, leanMass: 65.5, waist: 88, chest: 100, arm: 35 },
  { date: "2026-02-10", weight: 82.5, bodyFat: 20.5, leanMass: 65.5, waist: 86, chest: 101, arm: 35.5 },
  { date: "2026-03-10", weight: 81, bodyFat: 19, leanMass: 65.6, waist: 84, chest: 102, arm: 36 },
  { date: "2026-04-03", weight: 80, bodyFat: 18, leanMass: 65.6, waist: 83, chest: 103, arm: 36.5 },
];

const defaultNotifications: Notification[] = [
  {
    id: "n1", type: "booking",
    title: "Reserva confirmada",
    body: "Seu treino com Carlos Mendes está confirmado para amanhã às 08:00.",
    time: "há 5 min", read: false,
  },
  {
    id: "n2", type: "reminder",
    title: "Treino amanhã!",
    body: "Não se esqueça: você tem treino com Fernanda Lima amanhã às 07:00 na Bio Ritmo.",
    time: "há 2h", read: false,
  },
  {
    id: "n3", type: "update",
    title: "Seu treino foi atualizado",
    body: "Carlos Mendes fez ajustes no seu treino de Hipertrofia. Confira as novidades.",
    time: "ontem", read: true,
  },
  {
    id: "n4", type: "change",
    title: "Horário alterado",
    body: "Ana Paula Costa precisa remarcar sua sessão de quinta. Escolha um novo horário.",
    time: "2 dias atrás", read: true,
  },
  {
    id: "n5", type: "booking",
    title: "Sessão concluída",
    body: "Parabéns! Sua sessão de CrossFit com Fernanda Lima foi marcada como concluída.",
    time: "3 dias atrás", read: true,
  },
];

const defaultFilters: FilterState = {
  date: "2026-04-10",
  time: "08:00",
  mode: "Presencial",
  trainingType: "Musculação",
};

const AppContext = createContext<AppContextType>({
  filters: defaultFilters,
  setFilters: () => {},
  bookings: MOCK_BOOKINGS,
  addBooking: () => {},
  selectedGymId: null,
  setSelectedGymId: () => {},
  viewMode: "map",
  setViewMode: () => {},
  userType: null,
  setUserType: () => {},
  studentProfile: defaultStudentProfile,
  setStudentProfile: () => {},
  workout: defaultWorkout,
  setWorkout: () => {},
  evolution: defaultEvolution,
  addEvolution: () => {},
  notifications: defaultNotifications,
  markNotificationRead: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [userType, setUserType] = useState<"student" | "personal" | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(defaultStudentProfile);
  const [workout, setWorkout] = useState<Workout | null>(defaultWorkout);
  const [evolution, setEvolution] = useState<EvolutionEntry[]>(defaultEvolution);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  const addBooking = (b: Booking) => setBookings((prev) => [b, ...prev]);
  const addEvolution = (e: EvolutionEntry) => setEvolution((prev) => [e, ...prev]);
  const markNotificationRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <AppContext.Provider
      value={{
        filters, setFilters,
        bookings, addBooking,
        selectedGymId, setSelectedGymId,
        viewMode, setViewMode,
        userType, setUserType,
        studentProfile, setStudentProfile,
        workout, setWorkout,
        evolution, addEvolution,
        notifications, markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

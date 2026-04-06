import React, { createContext, useContext, useState } from "react";
import { MOCK_BOOKINGS, Booking } from "@/data/mockData";

interface FilterState {
  date: string;
  time: string;
  mode: "Presencial" | "Online";
  trainingType: string;
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
}

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
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const addBooking = (b: Booking) => {
    setBookings((prev) => [b, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        filters,
        setFilters,
        bookings,
        addBooking,
        selectedGymId,
        setSelectedGymId,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

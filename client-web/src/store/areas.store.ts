import { create } from 'zustand';

interface Area {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  action: any;
  reactions: any[];
}

interface AreasState {
  areas: Area[];
  setAreas: (areas: Area[]) => void;
  addArea: (area: Area) => void;
  updateArea: (id: string, area: Partial<Area>) => void;
  removeArea: (id: string) => void;
}

export const useAreasStore = create<AreasState>((set) => ({
  areas: [],
  setAreas: (areas) => set({ areas }),
  addArea: (area) => set((state) => ({ areas: [...state.areas, area] })),
  updateArea: (id, updatedArea) =>
    set((state) => ({
      areas: state.areas.map((area) =>
        area.id === id ? { ...area, ...updatedArea } : area
      ),
    })),
  removeArea: (id) =>
    set((state) => ({ areas: state.areas.filter((area) => area.id !== id) })),
}));

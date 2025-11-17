import { create } from 'zustand';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
}

interface ServicesState {
  services: Service[];
  setServices: (services: Service[]) => void;
  updateServiceConnection: (id: string, isConnected: boolean) => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  setServices: (services) => set({ services }),
  updateServiceConnection: (id, isConnected) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === id ? { ...service, isConnected } : service
      ),
    })),
}));

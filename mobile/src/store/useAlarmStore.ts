import { create } from 'zustand';
import { AlarmSettings, WakeSession } from '../types';

interface AlarmStore {
  settings: AlarmSettings;
  currentSession: WakeSession | null;
  updateSettings: (settings: Partial<AlarmSettings>) => void;
  setCurrentSession: (session: WakeSession | null) => void;
}

const defaultSettings: AlarmSettings = {
  hour: 7,
  minute: 0,
  pushupTarget: 25,
  brushingSeconds: 15,
  enabled: false,
};

export const useAlarmStore = create<AlarmStore>((set) => ({
  settings: defaultSettings,
  currentSession: null,
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  setCurrentSession: (session) => set({ currentSession: session }),
}));



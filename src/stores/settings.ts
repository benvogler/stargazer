import { StoreApi, UseBoundStore, create as createStore } from 'zustand';

export type SettingsStore = {
    mute: boolean,
    toggleMute: () => void
    privacy: boolean,
    togglePrivacy: () => void
};
export const useSettingsStore: UseBoundStore<StoreApi<SettingsStore>> = createStore(set => ({
    mute: true,
    toggleMute: () => set((state: SettingsStore) => ({ mute: !state.mute })),
    privacy: true,
    togglePrivacy: () => set((state: SettingsStore) => ({ privacy: !state.privacy} ))
}));
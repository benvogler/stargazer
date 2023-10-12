'use client';
import { StoreApi, UseBoundStore, create as createStore } from 'zustand';

import Welcome from './welcome';
import VolumeControl from './volumeControl';

import './globals.css'
import styles from './page.module.css';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Logo from './logo';

export type SettingsStore = {
    mute: boolean,
    toggleMute: () => void
};
export const useSettingsStore: UseBoundStore<StoreApi<SettingsStore>> = createStore(set => ({
    mute: true,
    toggleMute: () => set((state: SettingsStore) => ({ mute: !state.mute }))
}));

export default function Home() {
    const mute: boolean = useSettingsStore((state: SettingsStore) => state.mute);
    return (
        <main>
            <div className={styles.backgroundVignette}></div>
            <video className={styles.backgroundVideo} autoPlay loop muted={mute}>
                <source src="background.mp4" type="video/mp4"></source>
            </video>
            <div className={styles.interfaceWrapper}>
                <div className={styles.interface}>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <Logo className="text-sky-500 h-12 w-12"></Logo>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-large text-sky-300 tracking-normal">
                                    Stargazer Station
                                </h1>
                                <h2 className="text-base">Pleione 10 d, Inner Orion Spur</h2>
                            </div>
                        </div>
                        <VolumeControl></VolumeControl>
                    </div>
                    <Welcome></Welcome>
                </div>
            </div>
        </main>
    )
}

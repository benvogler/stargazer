'use client';

import Welcome from './welcome';
import VolumeControl from './volumeControl';
import { SettingsStore, useSettingsStore } from './settings.store';

import './globals.css'
import styles from './page.module.css';
import Logo from './logo';
import NewsTicker from './newsTicker';

export default function Home() {
    const mute: boolean = useSettingsStore((state: SettingsStore) => state.mute);
    return (
        <main>
            <div className={styles.backgroundVignette}></div>
            <video className={styles.backgroundVideo} autoPlay loop muted={mute}>
                <source src="background.mp4" type="video/mp4"></source>
            </video>
            <div className={styles.interfaceWrapper}>
                <div className={styles.interface + ' flex flex-col justify-between'}>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <Logo type="federation" className="text-sky-500 h-12 w-12"></Logo>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-large text-sky-300 tracking-normal">
                                    Stargazer Station
                                </h1>
                                <h2 className="text-base">Pleione 10 d, Inner Orion Spur</h2>
                            </div>
                        </div>
                        <VolumeControl></VolumeControl>
                    </div>
                    <div>
                        <Welcome></Welcome>
                    </div>
                    <div>
                        <NewsTicker></NewsTicker>
                    </div>
                </div>
            </div>
        </main>
    )
}

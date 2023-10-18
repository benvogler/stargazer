'use client';

import Welcome from '@/components/welcome/welcome';
import Icon from '@/components/icon/icon';
import NewsTicker from '@/components/newsTicker/newsTicker';
import VolumeControl from '@/components/volumeControl/volumeControl';
import LandingPads from '@/components/landingPads/landingPads';

import styles from './page.module.css';
import { SettingsStore, useSettingsStore } from '@/stores/settings';
import { useRef } from 'react';
import Notifications from '@/components/notifications/notifications';
import { useStore } from '@/utils/utils';
import { useNotificationsStore } from '@/stores/notifications';
import { useStationStore } from '@/stores/station';

export default function Home() {
    const mute = useSettingsStore((state: SettingsStore) => state.mute);
    const publish = useStore(useNotificationsStore, store => store.publish)!;
    const startShipActivities = useStore(useStationStore, store => store.startShipActivities)!;
    startShipActivities && startShipActivities(publish);
    return (
        <main>
            <div className={styles.backgroundVignette}></div>
            <video className={styles.backgroundVideo} autoPlay loop muted={mute}>
                <source src="background.mp4" type="video/mp4"></source>
            </video>
            <div className={styles.interfaceWrapper}>
                <div className={styles.interface + ' flex flex-col justify-between max-h-full overflow-y-auto'}>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <Icon name="federation" className="text-sky-500 h-14 w-14"></Icon>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-lg text-sky-300 tracking-normal">
                                    Stargazer Station
                                </h1>
                                <h2 className="text-base">Pleione 10 d, Inner Orion Spur</h2>
                            </div>
                        </div>
                        <VolumeControl></VolumeControl>
                    </div>
                    <div className="py-4 min-h-[1px] z-10">
                        <div className="flex relative h-full">
                            <LandingPads></LandingPads>
                            <Notifications></Notifications>
                            <Welcome></Welcome>
                        </div>
                    </div>
                    <div>
                        <NewsTicker></NewsTicker>
                    </div>
                </div>
            </div>
        </main>
    )
}

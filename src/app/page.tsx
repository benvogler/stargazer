'use client';

import Welcome from '@/components/welcome/welcome';
import Logo from '@/components/logo/logo';
import NewsTicker from '@/components/newsTicker/newsTicker';
import VolumeControl from '@/components/volumeControl/volumeControl';
import LandingPads from '@/components/landingPads/landingPads';

import './globals.css'
import styles from './page.module.css';
import { SettingsStore, useSettingsStore } from '@/stores/settings';
import { useRef, useState } from 'react';
import Notifications from '@/components/notifications/notifications';

export default function Home() {
    const mute: boolean = useSettingsStore((state: SettingsStore) => state.mute);
    const [ notifications, setNotifications ] = useState([]);
    const state: any = useRef();
    state.notifications = notifications;
    state.setNotifications = setNotifications;
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
                            <Logo type="federation" className="text-sky-500 h-14 w-14"></Logo>
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
                        <LandingPads onDeparture={landingPad => handleLandingPadDeparture(landingPad, state)}></LandingPads>
                        <Notifications notifications={notifications} setNotifications={setNotifications} removeNotification={(notification: any) => removeNotification(notification, state)}></Notifications>
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

function handleLandingPadDeparture(landingPad: any, {notifications, setNotifications}: {notifications: any, setNotifications: (notifications: any) => void}) {
    notifications.push({
        message: `${landingPad.name} is departing from landing pad ${landingPad.number}`
    });
    console.log('add', notifications);
    setNotifications(JSON.parse(JSON.stringify(notifications)));
}

function removeNotification(notification: any, {notifications, setNotifications}: {notifications: any, setNotifications: (notifications: any) => void}) {
    console.log('remove', notification.timeout, notifications, notifications.filter((n: any) => n.timeout !== notification.timeout));
    setNotifications(
        JSON.parse(JSON.stringify(
            notifications.filter((n: any) => n.timeout !== notification.timeout)
        ))
    );
}
const useSound = require('use-sound').default;
import { useStore } from "@/utils/utils";

import styles from './notifications.module.css';
import { NotificationsStore, useNotificationsStore } from "@/stores/notifications";
import { SettingsStore, useSettingsStore } from "@/stores/settings";
import { Sounds } from "@/utils/audio";
import ProgressBar from "../progressBar/progressBar";
import { useEffect, useState } from "react";

export default function Notifications() {
    const { notifications, initializeSounds } = useStore(useNotificationsStore, (state: NotificationsStore) => state) || {};
    const { mute } = useSettingsStore((state: SettingsStore) => state);
    const [ beepSfx ] = useSound(Sounds.beep, {volume: 0.5});
    initializeSounds && initializeSounds(mute, beepSfx);

    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 200);
        return () => clearInterval(interval);
    }, []);
    let [progresses, setProgresses]: [Map<number, number>, (progresses: Map<number, number>) => void] = useState(new Map());
    useEffect(() => {
        if (!notifications?.length) {
            return;
        }
        for (let notification of notifications) {
            progresses.set(
                notification.id,
                ((notification.expirationTime! - new Date().getTime()) / 1000) / notification.duration
            );
        }
        setProgresses(progresses);
    }, [setProgresses, progresses, notifications]);

    return (
        <div className="flex flex-col absolute bottom-0 right-0 items-center min-w-[320px] w-max-content">
            {
                notifications && notifications.map(notification => notification && (
                    <div className={`${styles.notification} bg-sky-950 z-10 border border-white border-opacity-5 flex items-center overflow-hidden ${notification.className}`} key={notification.body}>
                        <span className="relative">
                            <ProgressBar className="w-6 h-6 absolute left-0 translate-y-[-0.75rem]" progress={
                                notification.expirationTime ?
                                    ((notification.expirationTime - new Date().getTime()) / 1000) / notification.duration
                                    : 0
                                }
                            ></ProgressBar>
                            <span className="pl-8">
                                {notification.body}
                            </span>
                        </span>
                    </div>
                ))
            }
        </div>
    )
}
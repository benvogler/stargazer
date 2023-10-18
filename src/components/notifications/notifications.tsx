const useSound = require('use-sound').default;
import { useStore } from "@/utils/utils";

import styles from './notifications.module.css';
import { NotificationsStore, useNotificationsStore } from "@/stores/notifications";
import { SettingsStore, useSettingsStore } from "@/stores/settings";
import { Sounds } from "@/utils/audio";

export default function Notifications() {
    const { notifications, initializeSounds } = useStore(useNotificationsStore, (state: NotificationsStore) => state) || {};
    const { mute } = useSettingsStore((state: SettingsStore) => state);
    const [ beepSfx ] = useSound(Sounds.beep, {volume: 0.5});
    initializeSounds && initializeSounds(mute, beepSfx);
    return (
        <div className="flex flex-col absolute bottom-0 right-0 items-center min-w-[320px] w-max-content">
            {
                notifications && notifications.map(notification => notification && (
                    <div className={`${styles.notification} bg-sky-950 z-10 border border-white border-opacity-5 flex items-center overflow-hidden ${notification.className}`} key={notification.body}>
                        <span>
                            {notification.body}
                        </span>
                    </div>
                ))
            }
        </div>
    )
}
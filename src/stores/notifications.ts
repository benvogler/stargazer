import { StoreApi, UseBoundStore, create as createStore } from 'zustand';
import styles from '@/components/notifications/notifications.module.css';

export class Notification {
    public body: string;
    public duration: number;
    private _className: string = '';
    public constructor({body, duration=10}: {body: string, duration?: number}) {
        this.body = body;
        this.duration = duration;
        this._id = Notification.latestId++;
    }
    private static latestId: number = 0;
    private _id: number;
    public get id() {
        return this._id;
    }
    protected set className(value) {
        this._className = value;
    }
    public get className() {
        return this._className;
    }
    private _expirationTime?: number;
    protected set expirationTime(value) {
        this._expirationTime = value;
    }
    public get expirationTime() {
        return this._expirationTime;
    }
    private static mute: boolean;
    private static beepSfx: any;
    public static publish(notification: Notification): void {
        if (!notification) {
            return;
        }
        notification.expirationTime = new Date().getTime() + notification.duration * 1000;
        notifications = [
            notification,
            ...state.notifications
        ];
        if (!Notification.mute) {
            Notification.beepSfx();
        }
        set({notifications});
        window.setTimeout(() => {
            notifications = [...state.notifications.map(n => {
                if (n.id === notification.id) {
                    n.className = styles.close;
                }
                return n;
            })];
            set({notifications});
            window.setTimeout(() => {
                notifications = [
                    ...state.notifications.filter(n => n.id !== notification.id)
                ];
                set({notifications});
            }, 500);
        }, notification.duration * 1000);
    }

    public static initializeSounds(mute: boolean, beepSfx: any) {
        Notification.mute = mute;
        Notification.beepSfx = beepSfx;
    }
};

let notifications: Notification[] = [];

export type NotificationsStore = {
    notifications: Notification[],
    publish: (notification: Notification) => void,
    initializeSounds: (mute: boolean, beepSfx: any) => void
};

let set: any;

const state = {
    get notifications() {
        return notifications;
    },
    publish: Notification.publish,
    initializeSounds: Notification.initializeSounds
};

export const useNotificationsStore: UseBoundStore<StoreApi<NotificationsStore>> = createStore(s => {
    set = s;
    return state;
});

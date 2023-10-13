import { useEffect } from "react"

export default function Notifications({notifications, removeNotification, setNotifications}: any) {
    useEffect(() => {
        let hasChanged = false;
        for (let notification of notifications) {
            if (!notification.timeout) {
                hasChanged = true;
                notification.timeout = window.setTimeout(() => {
                    removeNotification(notification);
                }, 10000);
            }
        }
        if (hasChanged) {
            setNotifications(JSON.parse(JSON.stringify(notifications)));
        }
    }, [notifications, removeNotification, setNotifications])
    return (
        <div className="flex flex-col gap-4 fixed bottom-16">
            {
                notifications.map((notification: any) => (
                    <div className="bg-sky-950 z-10 border border-white border-opacity-5 p-2" key={notification.message}>
                        {notification.message}
                    </div>
                ))
            }
        </div>
    )
}
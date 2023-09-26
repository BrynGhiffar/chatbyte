const canShowNotification = () => {
    const browserSupportsNotification = 'Notification' in window;
    if (!browserSupportsNotification) return false;
    const permissionGranted = Notification.permission === 'granted';
    return permissionGranted;
}

export const askShowNotificationPermission = () => {
    const browserSupportsNotification = 'Notification' in window;
    if (!browserSupportsNotification) return;
    if (Notification.permission === 'denied') return;
    Notification.requestPermission();
}

export const showBrowserNotification = (title: string, body: string) => {
    if (!canShowNotification()) return;
    const notification = new Notification(title , { body, icon:  "/ferris.jpg"});
    notification.onclick = () => {
        notification.close();
    }
}
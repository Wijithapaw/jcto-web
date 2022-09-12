import { store } from "./store"
import { v4 as uuidv4 } from 'uuid';
import { AppNotification } from "./types";
import { dismissToast, showToast } from "./core-slice";

export enum NotificationType { 'error', 'success', 'warning' }

export function showNotification(type: NotificationType, message: string, title?: string) {
    const id = uuidv4();
    const notification: AppNotification = {
        id,
        type,
        message,
        title
    };

    store.dispatch(showToast(notification));

    const timeout = type === NotificationType.error ? 10000 : 5000;

    setTimeout(() => {
        store.dispatch(dismissToast(id));
    }, timeout);
}
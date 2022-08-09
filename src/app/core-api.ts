import { API } from "aws-amplify";
import { NotificationType, showNotification } from "./notification-service";

export const coreApi = {
    get
}

function handleError(err: any) {
    const status = err.response.status;
    const errMsg = err.response.data?.errorMessage || 'Unknoen error';
    showNotification(status === 400 ? NotificationType.warning : NotificationType.error, errMsg);
}

function get<T>(path: string, params?: any) {
    return API.get("jcto", path, params)
        .then(data => data as T)
        .catch(err => {
            handleError(err);
            throw err;
        });
}
import { Toast, ToastBody, ToastHeader } from "reactstrap";
import { dismissToast, notificationSelector } from "../app/core-slice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { NotificationType } from "../app/types";

export default function AppToast() {
    const notifications = useAppSelector(notificationSelector);

    const dispatch = useAppDispatch();

    const handleToggle = (id: string) => {
        dispatch(dismissToast(id));
    }

    return <div aria-live="polite" aria-atomic="true">
        <div style={{ position: "absolute", top: 0, right: 0, zIndex: 9999, float: "right" }}>
            {
                notifications.map(n => (<Toast key={n.id} className="m-2" style={{ background: 'white' }}>
                    <ToastHeader key={n.id} 
                        icon={n.type ===  NotificationType.error ? 'danger' : n.type === NotificationType.warning ? 'warning' : 'success'}
                        toggle={() => handleToggle(n.id)}>
                        {n.title || (n.type === NotificationType.error ? 'Error' : n.type === NotificationType.warning ? 'Warning' : 'Success')}
                    </ToastHeader>
                    <ToastBody>
                        {n.message}
                    </ToastBody>
                </Toast>))
            }
        </div>
    </div>
}

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AppIcon from "../../../components/AppIcon";
import { OrderStatus } from "../types";

interface Props {
    status: OrderStatus;
}

function getCssClass(status: OrderStatus) {
    switch (status) {
        case OrderStatus.Cancelled: return "text-danger";
        case OrderStatus.Delivered: return "text-success";
        default: return "";
    }
}

function getTitle(status: OrderStatus) {
    switch (status) {
        case OrderStatus.Cancelled: return "Cancelled";
        case OrderStatus.Delivered: return "Delivered";
        case OrderStatus.Undelivered: return "Undelivered";
        default: return "";
    }
}

function getIcon(status: OrderStatus): IconProp {
    switch (status) {
        case OrderStatus.Cancelled: return "ban";
        case OrderStatus.Delivered: return "check";
        case OrderStatus.Undelivered: return "hourglass-half";
        default: return "0";
    }
}

export default function OrderStatusIcon({ status }: Props) {
    return <AppIcon
        className={`${getCssClass(status)} ms-2 me-2`}
        icon={getIcon(status)}
        title={getTitle(status)}
    />
}

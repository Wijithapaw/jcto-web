import { coreApi } from "../../app/core-api";
import { EntityCreateResult, PagedResult } from "../../app/types";
import { Order, OrderListItem, OrdersFilter } from "./types";

export const orderApi = {
    createOrder,
    getOrder,
    updateOrder,
    searchOrder,
    downloadStockRelease,
    getNextOrderNo
}

function createOrder(order: Order) {
    return coreApi.post<EntityCreateResult>('orders', order);
}

function getOrder(id: string) {
    return coreApi.get<Order>(`orders/${id}`);
}

function searchOrder(filter: OrdersFilter) {
    return coreApi.get<PagedResult<OrderListItem>>(`orders`, filter);
}

function updateOrder(id: string, order: Order) {
    return coreApi.put<EntityCreateResult>(`orders/${id}`, order);
}

function downloadStockRelease(orderId: string, fileName: string) {
    return coreApi.download(`orders/${orderId}/stockrelease`, `${fileName}.xlsx`);
}

function getNextOrderNo(date: string) {
    return coreApi.get<number>(`orders/NextOrderNo`, { date });
}

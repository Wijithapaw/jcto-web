import { coreApi } from "../../app/core-api";
import { EntityCreateResult, PagedResult } from "../../app/types";
import { Order, OrderListItem, OrdersFilter } from "./types";

export const orderApi = {
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    searchOrder,
    downloadStockRelease,
    getNextOrderNo,
    cancelOrder,
    downloadOrdersReport,
    downloadPDDocument
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

function cancelOrder(id: string) {
    return coreApi.put(`orders/${id}/cancel`, {});
}

function deleteOrder(id: string) {
    return coreApi.del(`orders/${id}`);
}

function downloadStockRelease(orderId: string, fileName: string) {
    return coreApi.download(`orders/${orderId}/stockrelease`, `${fileName}.xlsx`);
}

function downloadPDDocument(orderId: string, fileName: string) {
    return coreApi.download(`orders/${orderId}/pddocument`, `${fileName}.xlsx`);
}

function downloadOrdersReport(filter: OrdersFilter) {
    return coreApi.download(`orders/Report`, `OrdersReport.xlsx`, filter);
}

function getNextOrderNo(date: string) {
    return coreApi.get<number>(`orders/NextOrderNo`, { date });
}

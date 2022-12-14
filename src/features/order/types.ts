import { AuditedEntity, PagedFilter } from "../../app/types";

export enum OrderStatus {
    Undelivered = 0,
    Delivered = 1,
    Cancelled = 2,
}

export enum BuyerType {
    Barge = 0,
    Bowser = 1,
}

export interface OrdersFilter extends PagedFilter {
    customerId: string;
    productId: string;
    from: string;
    to: string;
    status?: OrderStatus;
    orderNo?: number;
    buyer: string;
    buyerType?: BuyerType;
}

export interface OrderListItem {
    id: string;
    customer: string;
    product: string;
    quantity: number;
    deliveredQuantity?: number;
    orderDate: string;
    orderNo: number;
    buyer: string;
    buyerType: BuyerType;
    status: OrderStatus;
    taxPaid: boolean;
    issueStartTime?: string;
    issueEndTime?: string;
}

export interface Order extends AuditedEntity {
    customerId: string;
    productId: string;
    orderDate: string;
    orderNo?: number;
    buyer: string;
    status: OrderStatus;
    quantity: number;
    deliveredQuantity?: number;
    obRefPrefix: string;
    tankNo: string;
    buyerType: BuyerType;
    xBondNo?: string;
    releaseEntries?: OrderStockReleaseEntry[];
    bowserEntries?: BowserEntry[];
    remarks?: string;
    concurrencyKey?: string;
    taxPaid: boolean;
    issueStartTime?: string;
    issueEndTime?: string;
}

export interface OrderStockReleaseEntry {
    id: string;
    entryNo: string;
    approvalId: string;
    obRef: string;
    quantity: number;
    deliveredQuantity?: number
}

export interface BowserEntry {
    id: string;
    capacity: number;
    count: number;
}

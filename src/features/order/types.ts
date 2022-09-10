import { PagedFilter } from "../../app/types";
import { EntryApprovalType } from "../entry/types";

export enum OrderStatus {
    Undelivered = 0,
    Delivered = 1,
}

export enum BuyerType {
    Barge = 0,
    Bowser = 1,
}

export interface OrdersFilter extends PagedFilter{
    customerId: string;
    productId: string;
    from: string;
    to: string;
    status?: OrderStatus;
    orderNo: string;
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
    orderNo: string;
    buyer: string;
    buyerType: BuyerType;
    status: OrderStatus;
}

export interface Order {
    customerId: string;
    productId: string;
    orderDate: string;
    orderNo: string;
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
}

export interface OrderStockReleaseEntry {
    id: string;
    entryNo: string;
    approvalType?: EntryApprovalType;
    obRef: string;
    quantity: number;    
    deliveredQuantity?: number
}

export interface BowserEntry {
    id: string;
    capacity: number;
    count: number;
}

import { PagedFilter } from "../../app/types";
import { OrderStatus } from "../order/types";

export enum EntryStatus {
    Active = 0,
    Completed = 1
}

export enum EntryApprovalType {
    Rebond = 1,
    Xbond = 2,
    Letter = 3
}

export interface EntriesFilter extends PagedFilter {
    customerId: string;
    entryNo: string;
    from: string;
    to: string;
    activeEntriesOnly: boolean;
}

export interface Entry {
    entryNo: string;
    initialQuantity: number;
    productId: string;
    entryDate: string;
    customerId: string;
    customerName: string;
    status: EntryStatus;
}

export interface EntryListItem {
    id: string;
    customer: string;
    product: string;
    initialQuantity: number;
    remainingQuantity: number;
    entryDate: string;
    entryNo: string;
    status: EntryStatus;
    transactions: EntryTransaction[];
}

export interface EntryTransaction {
    orderDate: string;
    orderNo: string;
    orderStatus: OrderStatus;
    obRef: string;
    quantity: number;
    deliveredQuantity: number;
}

export interface EntryApproval {
    entryId: string;
    type?: EntryApprovalType;
    approvalRef: string;
    quantity: number;
    approvalDate: string;
}
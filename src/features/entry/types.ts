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

export enum EntryTransactionType {
    Approval = 0,
    Out = 1,
}

export interface EntriesFilter extends PagedFilter {
    customerId: string;
    productId: string;
    entryNo: string;
    toBondNo: string;
    from: string;
    to: string;
    activeEntriesOnly: boolean;
}

export interface Entry {
    entryNo: string;
    initialQuantity: number;
    toBondNo: string;
    entryDate: string;
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
    toBondNo: string;
    status: EntryStatus;
    transactions: EntryTransaction[];
}

export interface EntryTransaction {
    transactionDate: string;
    orderNo?: string;
    orderStatus?: OrderStatus;
    obRef?: string;
    quantity: number;
    deliveredQuantity: number;
    approvalType: EntryApprovalType;
    approvalRef?: string;
    type: EntryTransactionType;
}

export interface EntryApproval {
    entryId: string;
    type?: EntryApprovalType;
    approvalRef: string;
    quantity: number;
    approvalDate: string;
}

export interface EntryBalanceQty {
    id: string;
    entryNo: string;
    remainingQty: number;
    initialQty: number;
    rebond: number;
    xbond: number;
    letter: number;
}

export interface EntryRemaningApproval {
    id: string;
    entryNo: string;
    approvalType: EntryApprovalType;
    approvalRef: string;
    remainingQty: number;
}

export function getApprovalType(approvalType: EntryApprovalType) {
    switch (approvalType) {
        case EntryApprovalType.Rebond: return 'Rebond';
        case EntryApprovalType.Xbond: return 'Xbond';
        case EntryApprovalType.Letter: return 'Letter';
        default: return '';
    }
}

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
    RebondTo = 2
}

export interface EntriesFilter extends PagedFilter {
    customerId: string;
    productId: string;
    entryNo: string;
    from: string;
    to: string;
    active?: boolean;
}

export interface Entry {
    productId: string;
    customerId: string;
    entryNo: string;
    initialQuantity: number;
    entryDate: string;
    status: EntryStatus;
    concurrencyKey?: string;
}

export interface EntryRebondToDto {
    customerId: string;
    entryId: string;
    quantity: number;
    date: string;
    rebondNo: string;
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
    index: number;
    transactions: EntryTransaction[];
}

export interface EntryTransaction {
    id?: string;
    transactionDate: string;
    orderNo?: number;
    orderStatus?: OrderStatus;
    obRef?: string;
    quantity: number;
    deliveredQuantity: number;
    approvalType: EntryApprovalType;
    approvalRef?: string;
    approvalId?: string;
    type: EntryTransactionType;
    balance?: number;
    rebondedTo?: string;
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

export interface EntryApprovalSummary {
    customerId: string;
    productId: string;
    approvalId: string;
    tobondNo: string;
}

export function getApprovalType(approvalType: EntryApprovalType) {
    switch (approvalType) {
        case EntryApprovalType.Rebond: return 'Rebond';
        case EntryApprovalType.Xbond: return 'Xbond';
        case EntryApprovalType.Letter: return 'Letter';
        default: return '';
    }
}

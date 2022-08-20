export interface EntriesFilter {
    customerId: string;
    entryNo: string;
    from: string;
    to: string;
    activeEntriesOnly: boolean;
}

export interface Entry {
    entryNo: string;
    initialQuantity: number;
    productCode: string;
    entryDate: string;
    customerId: string;
    customerName: string;
    status: EntryStatus;
}

export enum EntryStatus {
    Active = 0,
    Completed = 1
}
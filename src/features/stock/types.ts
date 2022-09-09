import { PagedFilter } from "../../app/types";

export interface DischargesFilter extends PagedFilter {
    customerId: string;
    productId: string;
    from: string;
    to: string;
}

export interface Discharge {
    productId: string;
    customerId: string;
    toBondNo: string;
    quantity: number;
    transactionDate: string;
}

export interface StockDischargeListItem {
    id: string;
    customer: string;
    product: string;
    toBondNo: string;
    quantity: number;
    date: string;
}
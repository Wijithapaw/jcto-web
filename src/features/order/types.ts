export interface OrdersFilter {
    customerId: string;
    productId: string;
    from: string;
    to: string;
    status?: OrderStatus;
    orderNo: string;
}

export interface Order {
    customerId: string;
    productId: string;
    orderDate: string;
    orderNo: string;
    buyer: string;
    status: OrderStatus;
    quantity: number;
    obRefPrefix: string;    
    tankNo: string;
    buyerType: BuyerType;
    xBondNo?: string;
    releaseEntries?: OrderStockReleaseEntry[];
    bowserEntries?: BowserEntry[];
    remarks?: string;
}

export interface OrderStockReleaseEntry {
    id: string;
    entryNo: string;    
    obRef: string;
    quantity: number;
    deliveredQuantity: number
}

export interface BowserEntry {
    id: string;
    capacity: number;
    count: number;
}

export enum OrderStatus {
    Undelivered = 0,
    Delivered = 1,
}

export enum BuyerType {
    Barge = 0,
    Local = 1,
}
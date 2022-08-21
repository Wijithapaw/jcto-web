export interface OrdersFilter {
    customerId: string;
    productId: string;
    from: string;
    to: string;
    status?: OrderStatus;
    orderNo: string;
}

export interface Order {
    productId: string;
    orderDate: string;
    status: OrderStatus;
}

export enum OrderStatus {
    Undelivered = 0,
    Delivered = 1,
}
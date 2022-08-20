import { ListItem } from "../../app/types";

export interface CustomerStocks {
    customerId: string;
    customerName: string;
    stocks: ProductStock[];
}

export interface ProductStock {
    productId: string;
    remainingStock: number;
    undeliveredStock: number;
}

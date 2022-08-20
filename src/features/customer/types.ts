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

export const PRODUCT_CODES: ListItem[] = [
    { id: 'ID_GO', label: 'GO' },
    { id: 'ID_380_LSFO', label: '380_LSFO' },
    { id: 'ID_380_HSFO', label: '380_HSFO' }
]; 
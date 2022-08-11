export interface CustomerStocks {
    customer: string;
    stocks: ProductStock[];
}

export interface ProductStock {
    productCode: string;
    remainingStock: number;
    undeliveredStock: number;
}

export const PRODUCT_CODES: string[] = ['GO', '380_LSFO', '380_HSFO']; 
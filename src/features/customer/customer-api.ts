import { coreApi } from "../../app/core-api";
import { ListItem } from "../../app/types";
import { CustomerStocks } from "./types";

export const customerApi = {
    getCustomerStocks,
    getCustomerListItems
}

function getCustomerStocks() {
    return coreApi.get<CustomerStocks[]>('customers/stocks')
}

function getCustomerListItems() {
    return coreApi.get<ListItem[]>('customers/listitems')
}
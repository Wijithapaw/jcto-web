import { coreApi } from "../../app/core-api";
import { EntityCreateResult, PagedResult } from "../../app/types";
import { Discharge, DischargesFilter, StockDischargeListItem } from "./types";

export const stockApi = {
    topup,
    searchDischarges
}

function topup(discharge: Discharge) {
    return coreApi.post<EntityCreateResult>('stockes/topup', discharge);
}

function searchDischarges(filter: DischargesFilter) {
    return coreApi.get<PagedResult<StockDischargeListItem>>(`stockes/discharges`, filter);
}

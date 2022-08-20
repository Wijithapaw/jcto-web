import { coreApi } from "../../app/core-api";
import { EntityCreateResult } from "../../app/types";
import { Entry } from "./types";

export const entryApi = {
    createEntry
}

function createEntry(entry: Entry) {
    return coreApi.post<EntityCreateResult>('entries', entry);
}

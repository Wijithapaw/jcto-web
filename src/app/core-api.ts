import { API } from "aws-amplify";

export const coreApi = {
    get
}

function get<T>(path: string, params?: any) {
    return API.get("jcto", path, params).then(data => data as T);
}
import { rejects } from "assert";
import { API } from "aws-amplify";

export const coreApi = {
    get,
    post
}

function handleError(err: any) {
    const status = err.response.status;
    const errorMessage = err.response.data?.errorMessage || 'Unknown API error';
    return Promise.reject({ status, errorMessage })
}

function get<T>(path: string, params?: any) {
    return API.get("jcto", path, params)
        .then(data => data as T)
        .catch(handleError)
}

function post<T>(path: string, data: any) {
    return API.post("jcto", path, { body: data })
        .then(data => data as T)
        .catch(handleError);
}
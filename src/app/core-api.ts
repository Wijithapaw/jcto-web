import { API } from "aws-amplify";

export const coreApi = {
    get,
    post,
    put,
    download
}

function handleError(err: any) {
    const status = err.response.status;
    const errorMessage = err.response.data?.errorMessage || 'Unknown API error';
    return Promise.reject({ status, errorMessage })
}

function get<T>(path: string, params?: any) {
    return API.get("jcto", path, { queryStringParameters: params })
        .then(data => data as T)
        .catch(handleError)
}

function post<T>(path: string, data: any) {
    return API.post("jcto", path, { body: data })
        .then(data => data as T)
        .catch(handleError);
}

function put<T>(path: string, data: any) {
    return API.put("jcto", path, { body: data })
        .then(data => data as T)
        .catch(handleError);
}

function download(path: string, filename: string) {
    return API.get("jcto", path, {
        responseType: 'blob',
        response: true
    }).then((response) => {
        const blob = new Blob([response.data])
        saveFile(blob, filename);
    });
}

function saveFile(blob: Blob, filename: string) {
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
}
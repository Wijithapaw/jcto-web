import dayjs from "dayjs";

export const dateHelpers = {
    toDatetimeStr,
    toIsoString,
    strToDate,
    toShortDateStr,
    dateFormat
}

export const validationHelpers = {
    digitsOnly
}

function toDatetimeStr(date: Date | string) {
    return dayjs(date).format("DD/MM/YYYY hh:mm A");
}

function dateFormat(date: Date | string, format: string) {
    return dayjs(date).format(format);
}

function toIsoString(value?: Date) {
    return value ? dayjs(value).format("YYYY-MM-DDTHH:mm:ss") : ''
}

function strToDate(valueStr?: string) {
    return valueStr ? new Date(valueStr) : undefined;
}

function toShortDateStr(date: string) {
    return dayjs(date).format("DD/MM/YYYY");
}

function digitsOnly(value?: string) {
    return /^\d+$/.test(value || '')
}
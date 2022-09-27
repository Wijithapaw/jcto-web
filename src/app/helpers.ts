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

export const numbersHelpers = {
    toDisplayStr
}

function toDatetimeStr(date: Date | string) {
    return dayjs(date).format("DD/MM/YYYY HH:mm");
}

function dateFormat(date: Date | string, format: string) {
    return dayjs(date).format(format);
}

function toIsoString(value?: Date, includeTime?: boolean) {
    return value ? dayjs(value).format(includeTime ? "YYYY-MM-DDTHH:mm:ss" : "YYYY-MM-DD") : ''
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

function toDisplayStr(value: number) {
    return value === 0 ? 0 : value.toFixed(3);
}
import dayjs from "dayjs";

export const dateHelpers = {
    toDatetimeStr,
    toIsoString,
    strToDate
}

export const validationHelpers = {
    digitsOnly
}

function toDatetimeStr(date: Date | string) {
    return dayjs(date).format("DD/MM/YYYY h:mm A");
}

function toIsoString(value?: Date) {
    return value ? value.toLocaleDateString('en-CA') : ''
}

function strToDate(valueStr?: string) {
    return valueStr ? new Date(valueStr) : undefined;
}

function digitsOnly(value?: string) {
    return /^\d+$/.test(value || '')
}
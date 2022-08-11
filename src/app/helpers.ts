import dayjs from "dayjs";

export const dateHelpers = {
    toDatetimeStr
}

function toDatetimeStr(date: Date) {
    return dayjs(date).format("DD/MM/YYYY h:mm A");
}

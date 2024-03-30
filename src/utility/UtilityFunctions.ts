import moment from "moment";
import { logDebug } from "./Logger";

export const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
});

export const toImageSrc = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export const formatDate = (date: string): string => {
    // convert date from UTC iso string to local time
    const dd = moment.utc(date);
    logDebug(dd);
    if (!dd.isValid()) {
        return "Invalid Date";
    }
    return dd.local().format("HH:mm");
};

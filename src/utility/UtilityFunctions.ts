import moment from "moment";
import { logDebug } from "./Logger";
import useAppStore from "@/store/AppStore";
import { useSnackbar } from "@/store/AppStore/hooks";

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
    if (!dd.isValid()) {
        return "Invalid Date";
    }
    return dd.local().format("HH:mm");
};

export const filterSupportedAttachments = (acceptedFiles: File[]) => {
    const pushError = useAppStore.getState().pushSnackbarError;
    let files = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        if (file.type.startsWith("image/")) {
          files.push(file);
        } else {
          pushError("Currently we only support images as attachments");
        }
    }
    logDebug(files);
    return files;
}
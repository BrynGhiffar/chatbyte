import { LocalStorage } from "@/utility/LocalStorage";
import { AppStateSet } from "./type";
import { AuthService } from "@/service/api/AuthService";

export const pushSnackbarError = (set: AppStateSet, message: string) => {
    const id = Math.floor(Math.random() * 1_000);
    set(s => ({...s, snackbarMessage: [...s.snackbarMessage, { id, message, type: "failure" }]}));
};

export const pushSnackbarSuccess = (set: AppStateSet, message: string) => {
    const id = Math.floor(Math.random() * 1_000);
    set(s => ({...s, snackbarMessage: [...s.snackbarMessage, { id, message, type: "success" }]}));
};

export const getUserToken = async (set: AppStateSet): Promise<string | null> => {
    const token = LocalStorage.getLoginToken();
    if (!token) { 
        pushSnackbarError(set, "Token is missing");
        set(s => ({...s, type: "MISSING_TOKEN" }));
        return null;
    }
    const res = await AuthService.validateToken(token);
    if (!res.success) {
        pushSnackbarError(set, "Token is invalid");
        set(s => ({...s, type: "INVALID_TOKEN" }));
        return null;
    }
    return token;
}
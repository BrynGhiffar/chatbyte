
export const LocalStorage = {
    setLoginToken: (token: string) => {
        localStorage.setItem("USER_TOKEN", token);
    },
    getLoginToken: () => {
        return localStorage.getItem("USER_TOKEN");
    },
    removeLoginToken: () => {
        return localStorage.removeItem("USER_TOKEN");
    }
}
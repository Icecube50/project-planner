import { defineStore } from "pinia";

export const AuthStore = defineStore("auth", {
    state: () => ({
        token: null,
        user: null
    }),
    persist: true,
    actions: {
        setToken(token) {
            this.token = token;
        },
        setUser(user) {
            this.user = user;
        },
        logout() {
            this.token = null;
            this.user = null;
        },
        isLoggedIn() {
            return !!this.token;
        }
    },
})
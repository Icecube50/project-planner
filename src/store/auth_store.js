import { defineStore } from "pinia";
import api from "@/api/api";

export const AuthStore = defineStore("auth", {
    state: () => ({
        token: null,
        user: null,
        tokenExpiry: null
    }),
    persist: true,
    actions: {
        setToken(token) {
            this.token = token;

            const payload = JSON.parse(atob(token.split(".")[1]));
            this.tokenExpiry = payload.exp * 1000;
        },
        isTokenExpired() {
            return !this.tokenExpiry || Date.now() >= this.tokenExpiry;
        },
        login(user, token){
            this.user = user;
            this.setToken(token)
        },
        logout() {
            this.token = null;
            this.user = null;
            this.tokenExpiry = null;
        },
        isLoggedIn() {
            return !!this.token;
        },
        async refreshToken() {
            const res = await api.post(`/api/refresh`, {
                user: this.user,
            }, { skipAuth: true });

            if (res.status === 200) {
                console.log('refresh success')
                this.setToken(res.data.token);
                return
            } 
            
            console.log('refresh failed')
            throw res
        }
    },
})
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../baseUrl";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
    authState?: AuthState;
    onLogin?: (loginInfo: LoginInfo) => Promise<any>;
    onLogout?: () => Promise<any>;
};

type AuthState = {
    token: string | null;
    authenticated: boolean | null;
};

type LoginInfo = {
    username: string;
    password: string;
};

export const useAuth = () => useContext<AuthContextType>(AuthContext);

const TOKEN_KEY = "jwt-token";

// const API_URL = new URL("/api/v2", BASE_URL).toString();

const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        authenticated: false,
    });

    useEffect(() => {
        const getToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                setAuthState({
                    token,
                    authenticated: true,
                });
            }
        };
        getToken();
    }, []);

    const login = async (loginInfo: LoginInfo) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            console.log("requesting");
            const request = await fetch(`${BASE_URL}/api/v2/auth/login`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    kayttajatunnus: loginInfo.username,
                    salasana: loginInfo.password,
                }),
            });
            console.log("requesting2");
            if (!request.ok) throw new Error(request.statusText);
            const data = await request.json();
            console.log(data);

            setAuthState({
                token: data.token,
                authenticated: true,
            });

            // await SecureStore.setItemAsync(TOKEN_KEY, data.token);

            return data;
        } catch (e) {
            return { error: e };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setAuthState({
            token: null,
            authenticated: false,
        });
    };

    const value = {
        authState,
        onLogin: login,
        onLogout: logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

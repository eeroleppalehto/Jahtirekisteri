import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../baseUrl";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
    authState?: AuthState;
    onLogin?: (loginInfo: LoginInfo) => Promise<any>;
    onLogout?: () => Promise<any>;
};

export type AuthState = {
    token: string | null;
    username: string | null;
    role: string | null;
    authenticated: boolean | null;
};

type LoginResponse = {
    token: string;
    kayttajatunnus: string;
    rooli: string;
};

type LoginInfo = {
    username: string;
    password: string;
};

export const useAuth = () => useContext<AuthContextType>(AuthContext);

const TOKEN_KEY = "jwt-token";

const AuthContext = createContext<AuthContextType>({});

type UserInfo = {
    kayttajatunnus: string;
    rooli: string;
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        username: null,
        role: null,
        authenticated: false,
    });

    useEffect(() => {
        const getToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (!token) {
                setAuthState({
                    token: null,
                    username: null,
                    role: null,
                    authenticated: false,
                });
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const request = await axios.get<UserInfo>(
                `${BASE_URL}/api/v2/auth/user`
            );

            if (request.status >= 400) {
                setAuthState({
                    token: null,
                    username: null,
                    role: null,
                    authenticated: false,
                });
                return;
            }

            setAuthState({
                token,
                username: request.data.kayttajatunnus,
                role: request.data.rooli,
                authenticated: true,
            });
        };

        getToken();
    }, []);

    const login = async (loginInfo: LoginInfo) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            const request = await axios.post<LoginResponse>(
                `/api/v2/auth/login`,
                {
                    kayttajatunnus: loginInfo.username,
                    salasana: loginInfo.password,
                }
            );

            if (request.status >= 400) throw new Error("Error");

            setAuthState({
                token: request.data.token,
                username: request.data.kayttajatunnus,
                role: request.data.rooli,
                authenticated: true,
            });

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${request.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, request.data.token);

            return request.data;
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                return { error: e.message };
            }
            return { error: e };
        }
    };

    const logout = async () => {
        axios.defaults.headers.common["Authorization"] = "";
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setAuthState({
            token: null,
            username: null,
            role: null,
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

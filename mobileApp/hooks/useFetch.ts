import { useState, useEffect } from "react";
import { BASE_URL } from "../src/baseUrl";

function useFetch<T>(url: string, method: string, body: any) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const urlCompose = `${BASE_URL}/api/${url}`;

    const fetchGet = async () => {
        try {
            setLoading(true);
            const response = await fetch(urlCompose, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const json = await response.json();
            setData(json);
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            } else {
                setError(new Error("Unknown Error"));
            }
            setLoading(false);
        }
    };

    const fetchOther = async () => {
        try {
            setLoading(true);

            const response = await fetch(urlCompose, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const json = await response.json();
            setData(json);
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            } else {
                setError(new Error("Unknown Error"));
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        method === "GET" ? fetchGet() : fetchOther();
    }, [url]);
    return { data, error, loading };
}

export default useFetch;

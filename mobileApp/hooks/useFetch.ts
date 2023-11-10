import { useState, useEffect } from "react";
import { BASE_URL } from "../src/baseUrl";

function useFetch<T>(url: string) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const urlCompose = `${BASE_URL}/api/${url}`;

    useEffect(() => {
    const fetchGet = async () => {
        try {
            setLoading(true);
            const response = await fetch(urlCompose, {
                    method: "GET",
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

        fetchGet();
    }, [url]);
    return { data, error, loading };
}

export default useFetch;

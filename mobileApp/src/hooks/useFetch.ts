import { useState, useEffect } from "react";
import { BASE_URL } from "../baseUrl";
import { useAuth } from "../context/AuthProvider";

/**
 * Custom hook to fetch data from the backend. It returns the data, error and loading state to be used in the component.
 * @date 11/10/2023 - 11:01:48 AM
 *
 * @template T the type of the data
 * @param {string} url the url to fetch
 * @returns {{ data: any; error: any; loading: any; }} the data, error and loading state
 */
function useFetch<T>(url: string) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const { authState } = useAuth();

    const urlCompose = `${BASE_URL}/api/v1/${url}`;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (authState?.token)
        headers.append("Authorization", `Bearer ${authState.token}`);

    useEffect(() => {
        // Function to fetch data from the backend
        // and set the data, error and loading state accordingly
        const fetchGet = async () => {
            try {
                setLoading(true);
                const response = await fetch(urlCompose, {
                    method: "GET",
                    headers: headers,
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

        // Check if loading is false to prevent infinite loop
        if (!loading) return;

        fetchGet();
    }, [url, loading]);

    // Function for ScrollView and FlatList
    // to set the loading state to true
    // which will trigger the useEffect to fetch the data again
    const onRefresh = () => {
        setLoading(true);
    };

    return { data, error, loading, onRefresh };
}

export default useFetch;

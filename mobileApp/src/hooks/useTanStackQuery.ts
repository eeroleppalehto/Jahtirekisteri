import { useQuery } from "@tanstack/react-query";
import { ServerError, ServerErrorType } from "../utils/ServerError";
import axios from "axios";

export function useFetchQuery<T>(url: string, key: string) {
    const axiosQuery = () =>
        axios
            .get(`/api/v2/${url}`)
            .then((response) => response.data)
            .catch((error) => {
                if (!error.response) throw error;
                if (!error.response.data) throw error;

                console.log(typeof error.response.status);
                if (error.response.status >= 400) {
                    error.response.data as ServerErrorType;
                    throw new ServerError(error.response.data);
                }
            });

    const query = useQuery<T>({
        queryKey: [key],
        queryFn: axiosQuery,
    });

    return query;
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { ServerError, ServerErrorType } from "../utils/ServerError";
import axios from "axios";

export function useFetchQuery<T>(url: string, key: any[]) {
    const axiosQuery = () =>
        axios
            .get(`/api/v2/${url}`)
            .then((response) => response.data)
            .catch((error) => {
                if (!error.response) throw error;
                if (!error.response.data) throw error;

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

export function usePostQuery<T>(url: string) {
    const axiosQuery = (data: any) =>
        axios
            .post(`/api/v2/${url}`, data)
            .then((response) => response.data)
            .catch((error) => {
                if (!error.response) throw error;
                if (!error.response.data) throw error;

                if (error.response.status >= 400) {
                    error.response.data as ServerErrorType;
                    throw new ServerError(error.response.data);
                }
            });

    const mutation = useMutation<T>({
        mutationFn: axiosQuery,
    });

    return mutation;
}

export function usePutQuery<T>(url: string, data: any) {
    const axiosQuery = () =>
        axios
            .put(`/api/v2/${url}`, data)
            .then((response) => response.data)
            .catch((error) => {
                if (!error.response) throw error;
                if (!error.response.data) throw error;

                if (error.response.status >= 400) {
                    error.response.data as ServerErrorType;
                    throw new ServerError(error.response.data);
                }
            });

    const mutation = useMutation<T>({
        mutationFn: axiosQuery,
    });

    return mutation;
}

export function axiosPost(url: string) {
    return (data: any) =>
        axios
            .post(`/api/v2/${url}`, data)
            .then((response) => response.data)
            .catch((error) => {
                if (!error.response) throw error;
                if (!error.response.data) throw error;

                if (error.response.status >= 400) {
                    error.response.data as ServerErrorType;
                    throw new ServerError(error.response.data);
                }
            });
}

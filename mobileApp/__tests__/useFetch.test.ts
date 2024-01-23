import useFetch from "../src/hooks/useFetch";
import { act, renderHook, waitFor } from "@testing-library/react-native";

it("should return the data, error and loading state on beginning", async () => {
    const { result } = renderHook(() => useFetch("members"));
    expect(result.current.data).toBe(undefined);
    expect(result.current.error).toBe(undefined);
    expect(result.current.loading).toBe(true);
});

it("should update the data, error and loading state after fetching", async () => {
    const { result } = renderHook(() => useFetch("members"));
    await waitFor(() => {
        expect(result.current.data).toBeTruthy();
        expect(result.current.error).toBe(undefined);
        expect(result.current.loading).toBe(false);
    });
});

it("should set the loading state to true when onRefresh is called", async () => {
    const { result } = renderHook(() => useFetch("members"));
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    act(() => {
        result.current.onRefresh();
    });

    expect(result.current.loading).toBe(true);
});

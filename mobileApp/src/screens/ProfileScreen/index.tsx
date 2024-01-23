import { View } from "react-native";
import { Text } from "react-native-paper";
import useFetch from "../../hooks/useFetch";

export default function ProfileScreen() {
    const { data, loading, error } = useFetch<any>("test");
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
            }}
        >
            <Text>Profile</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <Text>{`${data.message}: ${data.data.kayttajatunnus}`}</Text>
            )}
        </View>
    );
}

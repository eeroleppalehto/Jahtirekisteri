import { ActivityIndicator, Surface } from "react-native-paper";
import { View } from "react-native";

type Props = {
    size?: "small" | "large" | number;
};

// Component for displaying a default activity indicator
export function DefaultActivityIndicator({ size }: Props) {
    const checkedSize = size ? size : "large";

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator animating={true} size={checkedSize} />
        </View>
    );
}

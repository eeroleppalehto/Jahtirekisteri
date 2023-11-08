import { TextInput, Text, Button, SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import { ScrollView } from "react-native";
import jasenService from "../../services/jasenService";
import { JasenForm } from "../../types";
import { useNavigation } from "@react-navigation/native";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";

type navType = MaintenanceTabScreenProps<"Jäsenet">["navigation"];

export default function MemberForm() {
    const [form, setForm] = useState<JasenForm>({
        etunimi: "",
        sukunimi: "",
        jakeluosoite: "",
        postinumero: "",
        postitoimipaikka: "",
        tila: "aktiivinen", // 'aktiivinen' | 'poistunut'
    });
    const navigation = useNavigation<navType>();

    const onSubmit = () => {
        const member = jasenService.create(form);
        setForm({
            etunimi: "",
            sukunimi: "",
            jakeluosoite: "",
            postinumero: "",
            postitoimipaikka: "",
            tila: "aktiivinen",
        });
        Promise.resolve(member).then((member) =>
            navigation.navigate("Jäsenet", { data: member })
        );
    };

    const mode = "outlined";

    return (
        <ScrollView>
            <TextInput
                mode={mode}
                label="*Etunimi"
                value={form.etunimi}
                onChangeText={(text) => setForm({ ...form, etunimi: text })}
                style={{ margin: 15 }}
            />
            <TextInput
                mode={mode}
                label="*Sukunimi"
                value={form.sukunimi}
                onChangeText={(text) => setForm({ ...form, sukunimi: text })}
                style={{ margin: 15 }}
            />
            <TextInput
                mode={mode}
                label="*Osoite"
                value={form.jakeluosoite}
                onChangeText={(text) =>
                    setForm({ ...form, jakeluosoite: text })
                }
                style={{ margin: 15 }}
            />
            <TextInput
                mode={mode}
                label="*Postinumero"
                keyboardType="numeric"
                value={form.postinumero}
                onChangeText={(text) => setForm({ ...form, postinumero: text })}
                style={{ margin: 15 }}
            />
            <TextInput
                mode={mode}
                label="*Postitoimipaikka"
                value={form.postitoimipaikka}
                onChangeText={(text) =>
                    setForm({ ...form, postitoimipaikka: text })
                }
                style={{ margin: 15 }}
            />
            <SegmentedButtons
                value={form.tila}
                onValueChange={(value) => setForm({ ...form, tila: value })}
                buttons={[
                    {
                        value: "aktiivinen",
                        label: "Aktiivinen",
                        showSelectedCheck: true,
                    },
                    {
                        value: "poistunut",
                        label: "Poistunut",
                        showSelectedCheck: true,
                    },
                ]}
                style={{ margin: 15 }}
            />
            <Text style={{ margin: 30 }}>
                *-merkityt kentät ovat pakollisia
            </Text>
            <Button
                mode="contained"
                onPress={() => onSubmit()}
                disabled={false}
                style={{ margin: 15, marginTop: 30 }}
            >
                {" "}
                LISÄÄ JÄSEN{" "}
            </Button>
        </ScrollView>
    );
}

import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { CISA, updateCISA } from "@/utils/Vuln";

export default function Index() {
    const [mainArray, setArray] = React.useState(Array<CISA>());

    React.useEffect(() => {
        updateCISA().then((value) => setArray(value));
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View style={{ flex: 5 }}>
                <FlatList
                    data={
                        mainArray.length > 50
                            ? mainArray.slice(0, 50)
                            : mainArray
                    }
                    renderItem={({ item, index }) => {
                        const lastMonth = new Date(
                            Date.now() - 1000 * 60 * 60 * 24 * 30
                        ).getTime();
                        const color =
                            lastMonth < new Date(item.dateAdded).getTime()
                                ? "#faa"
                                : index % 2
                                ? "#aaa"
                                : "#ddd";
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    marginVertical: 4,
                                    paddingVertical: 4,
                                    backgroundColor: color,
                                }}
                            >
                                <Text
                                    style={{ fontWeight: "bold", fontSize: 24 }}
                                >
                                    Company affected: {item.vendorProject}
                                </Text>
                                <Text style={{ fontSize: 20 }}>
                                    Known as of {item.dateAdded}
                                </Text>
                                <Text style={{ fontSize: 16 }}>
                                    {item.shortDescription}
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                    alignItems: "center",
                }}
            >
                <View style={{ flex: 1 }}>
                    <Link
                        href="/Quizzlet"
                        style={style.link}
                    >
                        Quiz
                    </Link>
                </View>
                <View style={{ flex: 1 }}>
                    <Link
                        href="/Reporter"
                        style={style.link}
                    >
                        Reports
                    </Link>
                </View>
                {/* <View style={{ flex: 1 }}>
                    <Link
                        href="/Devices"
                        style={style.link}
                    >
                        Devices
                    </Link>
                </View> */}
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    link: {
        alignSelf: "center",
        color: "#0060ff",
        fontSize: 24,
        backgroundColor: "",
        paddingHorizontal: 30,
        paddingVertical: 8,
    },
});

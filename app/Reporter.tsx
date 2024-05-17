import { CISA, NIST, updateCISA, updateNIST } from "@/utils/Vuln";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

function ItemsC({ listing, index }: { listing: CISA; index: number }) {
    //console.log('posting listing');

    return (
        <View
            style={{
                backgroundColor: index % 2 ? "#F1EB90A0" : "#9FBB73A0",
                margin: 4,
            }}
        >
            <Text>Company or product involved: {listing.vendorProject}</Text>
            <Text>Known as of {listing.dateAdded}</Text>
            <Text>{listing.shortDescription}</Text>
            <Text>
                Used for ransomware: {listing.knownRansomwareCampaignUse}
            </Text>
        </View>
    );
}

function ItemsN({ listing, index }: { listing: NIST; index: number }) {
    const item = listing.cve;
    const date = new Date(item.published).toLocaleString();
    return (
        <View
            style={{
                backgroundColor: index % 2 ? "#F78812A0" : "#E02401A0",
                margin: 4,
            }}
        >
            <Text>Company or product involved: {item.sourceIdentifier}</Text>
            <Text>Known as of {date}</Text>
            <Text>{item.descriptions[0].value}</Text>
        </View>
    );
}

const Report = () => {
    const [dataCISA, setDataCISA] = useState(Array<CISA>());
    const [dataNIST, setDataNIST] = useState(Array<NIST>());

    useEffect(() => {
        console.log("effect");
        updateNIST().then((value) => setDataNIST(value));
        updateCISA().then((value) => setDataCISA(value));
    }, []);

    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        alignSelf: "center",
                        fontSize: 24,
                        fontWeight: "500",
                    }}
                >
                    Reports from the government
                </Text>
                <FlatList
                    style={{ flex: 1 }}
                    data={
                        dataCISA.length > 50 ? dataCISA.slice(0, 50) : dataCISA
                    }
                    renderItem={({ item, index }) => (
                        <ItemsC
                            listing={item}
                            index={index}
                        />
                    )}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        alignSelf: "center",
                        fontSize: 24,
                        fontWeight: "500",
                    }}
                >
                    Current reports
                </Text>
                <FlatList
                    style={{ flex: 1 }}
                    data={
                        dataNIST.length > 50 ? dataNIST.slice(0, 50) : dataNIST
                    }
                    renderItem={({ item, index }) => (
                        <ItemsN
                            listing={item}
                            index={index}
                        />
                    )}
                />
            </View>
        </View>
    );
};

export default Report;

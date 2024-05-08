import Axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

type CISA = {
    cveID: string;
    vendorProject: string;
    product: string;
    vulnerabilityName: string;
    dateAdded: string;
    shortDescription: string;
    requiredAction: string;
    dueDate: string;
    knownRansomwareCampaignUse: string;
    notes: string;
}

type NIST = {
    cve: {
        id: string,
        sourceIdentifier: string,
        published: string,
        lastModified: string,
        vulnStatus: string,
        descriptions: Array<{
            lang: string,
            value: string,
        }>,
        references: Array<{
            url: string,
            source: string,
        }>
    }
}

function Items({ listing }: { listing: CISA }) {
    console.log('posting listing');
    return (
        <View style={{ backgroundColor: 'blue', margin: 4 }}>
            <Text>Company or product involved: {listing.vendorProject}</Text>
            <Text>Known as of {listing.dateAdded}</Text>
            <Text>{listing.shortDescription}</Text>
            <Text>Used for ransomware: {listing.knownRansomwareCampaignUse}</Text>
        </View>
    )
}

const Report = () => {
    // TODO: create a fetch for data
    // TODO: create a link to the ai responder

    const [data, setData] = useState(Array<CISA>);

    useEffect(() => {
        console.log('effect');
        // updateCVE()
        updateCISA()
    }, []);

    function updateNIST() {
        if (data.length > 0) {
            return;
        }
        const connect = Axios.create({
            timeout: 2000,
            responseType: 'json',
        });
        const lastWeek = Date.now() - (1000 * 60 * 60 * 24 * 7);
        const lastWeekISO = (new Date(lastWeek)).toISOString();
        const todayISO = (new Date(Date.now())).toISOString();
        const URL = `https://services.nvd.nist.gov/rest/json/cves/2.0/?pubStartDate=${lastWeek}&pubEndDate=${todayISO}&noRejected`
        connect.get(URL).then(value => {

        })
    }

    function updateCISA() {
        if (data.length > 0) {
            console.log(data);
            return;
        }
        const grab = require('../assets/known_exploited_vulnerabilities.json');
        const sorting = grab.vulnerabilities as Array<CISA>;
        sorting.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
        setData(sorting);
        return;
        const connect = Axios.create({
            timeout: 2000,
            responseType: 'json',
        })
        const CISA = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
        connect.get(CISA).then((res) => {
            console.log('New thing', res.data.vulnerabilities);
            const toSort = [...res.data.vulnerabilities];
            toSort.sort((a, b) =>
                Date.parse(a.dateAdded) - Date.parse(b.dateAdded)
            );
            console.log(toSort);
            setData(toSort);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {

        });
    }

    return (
        <View>
            <Text>Current reports</Text>
            <Text>Reports from the government</Text>
            <FlatList
                data={data}
                renderItem={({ item }) => <Items listing={item} />}
            />
        </View>
    )
}

export default Report;

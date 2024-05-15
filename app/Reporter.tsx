import { getItem, setItem } from "@/utils/LocalStore";
import { ask } from "@/utils/textAI";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export type CISA = {
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
};

type NIST = {
  cve: {
    id: string;
    sourceIdentifier: string;
    published: string;
    lastModified: string;
    vulnStatus: string;
    descriptions: Array<any>;
    references: Array<any>;
  };
};

function ItemsC({ listing, index }: { listing: CISA; index: number }) {
  //console.log('posting listing');

  return (
    <View
      style={{
        backgroundColor: index % 2 ? "#00ffff60" : "#00ff0f60",
        margin: 4,
      }}
    >
      <Text>Company or product involved: {listing.vendorProject}</Text>
      <Text>Known as of {listing.dateAdded}</Text>
      <Text>{listing.shortDescription}</Text>
      <Text>Used for ransomware: {listing.knownRansomwareCampaignUse}</Text>
    </View>
  );
}

function ItemsN({ listing, index }: { listing: NIST; index: number }) {
  //console.log('posting listing', listing);
  return (
    <View
      style={{
        backgroundColor: index % 2 ? "#ffa00060" : "#ff000060",
        margin: 4,
      }}
    >
      <Text>Company or product involved: {listing.cve.sourceIdentifier}</Text>
      <Text>{listing.cve.descriptions[0].value}</Text>
    </View>
  );
}

const Report = () => {
  // TODO: create a fetch for data
  // TODO: create a link to the ai responder

  const [data, setData] = useState(Array<CISA>());
  const [dataN, setDataN] = useState(Array<NIST>());

  useEffect(() => {
    console.log("effect");
    updateNIST();
    updateCISA();
  }, []);

  async function updateNIST() {
    setDataN(await getItem("nist"));
    if (dataN.length > 0) {
      return;
    }
    const connect = Axios.create({
      timeout: 2000,
      responseType: "json",
    });
    const lastWeek = Date.now() - 1000 * 60 * 60 * 24 * 7;
    const lastWeekISO = new Date(lastWeek).toISOString();
    const todayISO = new Date(Date.now()).toISOString();
    const URL = `https://services.nvd.nist.gov/rest/json/cves/2.0/?pubStartDate=${lastWeekISO}&pubEndDate=${todayISO}&noRejected`;
    const result = await connect.get(URL);
    await setItem("nist", result.data.vulnerabilities);
    setDataN(result.data.vulnerabilities);
  }

  async function updateCISA() {
    setData(await getItem("cisa"));
    if (data !== null && data.length > 0) {
      return;
    }
    const grab = require("../assets/known_exploited_vulnerabilities.json");
    const sorting = grab.vulnerabilities as Array<CISA>;
    sorting.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
    setData(sorting);
    if (sorting.length < 0) {
      return;
    }
    const connect = Axios.create({
      timeout: 2000,
      responseType: "json",
    });
    const CISA =
      "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
    const result = await connect.get(CISA);
    const toSort = [...result.data.vulnerabilities] as Array<CISA>;
    toSort.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
    for (let i = 0; i < 20; i++) {
      //console.log('asking google ai');
      const rewrote = await ask(toSort[i].shortDescription);
      toSort[i].shortDescription = rewrote;
    }
    setData(toSort);
    setItem("cisa", toSort);
  }

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <Text style={{ alignSelf: "center" }}>Reports from the government</Text>
        <FlatList
          style={{ flex: 1 }}
          data={data.length > 50 ? data.slice(0, 50) : data}
          renderItem={({ item, index }) => (
            <ItemsC listing={item} index={index} />
          )}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ alignSelf: "center" }}>Current reports</Text>
        <FlatList
          style={{ flex: 1 }}
          data={dataN.length > 50 ? dataN.slice(0, 50) : dataN}
          renderItem={({ item, index }) => (
            <ItemsN listing={item} index={index} />
          )}
        />
      </View>
    </View>
  );
};

export default Report;

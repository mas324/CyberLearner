import Axios from "axios";
import { getItem, setItem } from "./LocalStore";
import { addDesc, getAllDescriptions } from "./Firestore";
import { ask } from "./textAI";

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

export type NISTDescription = {
    lang: string;
    value: string;
};

export type NISTReferences = {
    url: string;
    source: string;
};

export type NIST = {
    cve: {
        id: string;
        sourceIdentifier: string;
        published: string;
        lastModified: string;
        vulnStatus: string;
        descriptions: Array<NISTDescription>;
        references: Array<NISTReferences>;
    };
};

export async function updateNIST() {
    const data = (await getItem("nist")) as Array<NIST>;
    if (data.length > 0) {
        return data;
    }

    const connect = Axios.create({
        timeout: 1000 * 60,
        responseType: "json",
    });
    const lastWeek = Date.now() - 1000 * 60 * 60 * 24 * 7;
    const lastWeekISO = new Date(lastWeek).toISOString();
    const todayISO = new Date(Date.now()).toISOString();
    const URL = `https://services.nvd.nist.gov/rest/json/cves/2.0/?pubStartDate=${lastWeekISO}&pubEndDate=${todayISO}&noRejected&resultsPerPage=100`;
    // console.log(URL);
    const result = await connect.get(URL);
    await setItem("nist", result.data.vulnerabilities);
    return result.data.vulnerabilities as Array<NIST>;
}

export async function getNIST(cveID: string) {
    const URL = `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveID}`;
    const result = await Axios.create({
        timeout: 1000 * 60,
        responseType: "json",
    }).get(URL);

    if (
        result.data == null ||
        result.data.vulnerabilities == null ||
        !Array.isArray(result.data.vulnerabilities) ||
        result.data.vulnerabilities.length == 0
    ) {
        return null;
    }
    return result.data.vulnerabilities[0] as NIST;
}

export async function getCVE(cveID: string) {
    const URL = `https://cveawg-test.mitre.org/api/cve/${cveID}`;
    const result = await Axios.create({
        timeout: 10000,
        responseType: "json",
    }).get(URL);
    console.log(result.data);
}

export async function updateCISA() {
    const data = (await getItem("cisa")) as Array<CISA>;
    // getCVE(data[0].cveID);
    if (data !== null && data.length > 0) {
        return data;
    }

    const grab = require("../assets/known_exploited_vulnerabilities.json");
    const sorting = grab.vulnerabilities as Array<CISA>;
    sorting.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
    if (sorting.length < 0) {
        return sorting;
    }

    const connect = Axios.create({
        timeout: 2000,
        responseType: "json",
    });
    const CISA =
        "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
    const result = await connect.get(CISA);
    const toSort = result.data.vulnerabilities as Array<CISA>;
    const translated = await getAllDescriptions();
    toSort.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));

    for (let i = 0; i < toSort.length; i++) {
        if (translated != null) {
            const x = translated.findIndex((val) => {
                // console.log("logging", i, val, toSort[i]);
                return val.cve_id === toSort[i].cveID;
            });
            if (x >= 0) {
                // console.log('resetting description', translated[x]);
                toSort[i].shortDescription = translated[x].description;
                continue;
            }
        }
        const rewrote = await ask(toSort[i].shortDescription);
        if (rewrote !== null) {
            toSort[i].shortDescription = rewrote;
            await addDesc({ cve_id: toSort[i].cveID, description: rewrote });
        }
    }
    setItem("cisa", toSort);
    return toSort;
}

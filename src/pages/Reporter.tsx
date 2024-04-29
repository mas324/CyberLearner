import Axios from "axios";
import React, { useEffect, useState } from "react";

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

function Items({ id, date, ransomware, desc, vendor }) {
    return (
        <div>
            <h3>{vendor}</h3>
            <p>Known as of {date}</p>
            <p>{desc}</p>
            <p>Used for ransomware: {ransomware}</p>
        </div>
    )
}

const Report = () => {
    // TODO: create a fetch for data
    // TODO: create a link to the ai responder

    const [data, setData] = useState(Array<CISA>);

    useEffect(() => {
        if (data.length > 0) {
            console.log(data);
            return;
        }
        const connect = Axios.create({
            timeout: 2000,
            responseType: 'json',
        })
        const CISA = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
        connect.get(CISA).then((res) => {
            setData(res.data.vulnerabilities);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            let sort = data.slice();
            sort.sort((a, b) =>
                Date.parse(a.dateAdded) - Date.parse(b.dateAdded)
            );
            setData(sort);
        });
    }, [data]);

    return (
        <div>
            <h1>Current reports</h1>
            <h2>Reports from the government</h2>
            {data.length ? (
                data.map((value, index) => {
                    return <Items
                        key={index}
                        vendor={value.vendorProject}
                        desc={value.shortDescription}
                        id={value.cveID}
                        date={value.dateAdded}
                        ransomware={value.knownRansomwareCampaignUse === "Known"} />
                })
            ) : (null)}
            <h2>Other reports</h2>
        </div>
    )
}

export default Report;

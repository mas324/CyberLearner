import Axios from "axios";
import React, { useEffect, useState } from "react";

function Items({ id, date, ransomware, desc, vendor }) {
    return (
        <div>
            <h3>{vendor}</h3>
            {desc}
        </div>
    )
}

const Report = () => {
    // TODO: create a fetch for data
    // TODO: create a link to the ai responder
    const [data, setData] = useState([]);

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
        })
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
                    />
                })
            ) : (null)}
            <h2>Other reports</h2>
        </div>
    );
}

export default Report;

import Axios from "axios";
import React from "react";

function Items(data) {
    return data.map(vul => <li>{vul}</li>)
}

const Report = () => {
    // TODO: create a fetch for data
    // TODO: create a link to the ai responder
    const connect = Axios.create({
        timeout: 2000,
        responseType: 'json',
    })
    let data = [];
    const CISA = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
    connect.get(CISA).then(res => {
        console.log(res);
        data = res.data.vunerabilities;
    }).catch(err => {
        console.error(err);
    });

    return (
        <div>
            <h1>Current reports</h1>
            <h2>Reports from the government</h2>
            {Items(data)}
            <h2>Other reports</h2>
        </div>
    );
}

export default Report;

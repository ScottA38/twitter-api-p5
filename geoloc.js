import fetch from 'node-fetch';
import 'dotenv/config';

const urlBase = "https://api.mapbox.com/";
const urlPath = "geocoding/v5/mapbox.places";

export default async (place) => {
    return new Promise((resolve, reject) => {
        let fullPath = `${urlPath}/${encodeURIComponent(place)}.json`;
        let url = new URL(fullPath, urlBase);
        url.search = `access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
        fetch(url, {})
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                resolve(json);
            });
    });
};
import axios from "./axios";

export async function setTimezone(data) {
    return {
        type: "SET_TIMEZONE",
        data,
    };
}

export async function getResults(tz) {
    console.log(tz);
    const { data } = axios.get(`/listen-now/${tz}`);

    return {
        type: "GET_RESULTS",
        data,
    };
}

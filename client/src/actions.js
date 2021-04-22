import axios from "./axios";

export async function setTimezone(data) {
    console.log(data);
    return {
        type: "SET_TIMEZONE",
        data,
    };
}

export async function getResults(timenow, timezone) {
    const { data } = await axios.get(`/listen-now/${timenow}`);
    return {
        type: "GET_RESULTS_BY_DAY",
        payload: { data, timezone },
    };
}

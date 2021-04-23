import axios from "./axios";

export async function setTimezone(data) {
    console.log(data);
    return {
        type: "SET_TIMEZONE",
        data,
    };
}

export async function getResults(timeNow, timezone) {
    console.log(timeNow, timezone);
    const { data } = await axios.get(`/api/listen-now/`, {
        params: { timeNow },
    });

    return {
        type: "GET_RESULTS",
        data,
        timezone,
    };
}

export async function setPlayerUrl(url) {
    return {
        type: "SET_PLAYER_URL",
        url,
    };
}

export async function clearBoard() {
    return {
        type: "CLEAR_BOARD",
    };
}

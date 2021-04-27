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
    await axios.post("/timezone/", { timezone });
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

export async function sendPost(link, message, tags) {
    let data = {
        link,
        message,
        tags,
    };
    const payload = await axios.post("/submit/", data);

    return {
        type: "SUBMIT_POST",
        data: payload,
    };
}

export async function joinRoom(data) {
    return {
        type: "JOIN_ROOM",
        data,
    };
}

export async function activeUser(socketId) {
    return {
        type: "ACTIVE_USER",
        socketId,
    };
}

export async function toggleReady(userId) {
    return {
        type: "TOGGLE_READY",
        userId,
    };
}

export async function setPlayerProgress(progress) {
    return {
        type: "SET_PLAYER_PROGRESS",
        progress,
    };
}

export async function setPlaying(boolean) {
    return {
        type: "SET_PLAYING",
        boolean,
    };
}

export async function toggleHostPlaying(boolean) {
    return {
        type: "TOGGLE_HOST_PLAYING",
        boolean,
    };
}

export async function getSearchResults(params) {
    console.log("action.js", params);
    const { data } = await axios.get("/api/search/", { params });
    console.log(data);
}

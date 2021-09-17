import axios from "./axios";

export async function setTimezone(data) {
    data;
    return {
        type: "SET_TIMEZONE",
        data,
    };
}

export async function getResults(timeNow, timezone) {
    timeNow, timezone;
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

export async function getSearchResults(params) {
    const { data } = await axios.get("/api/search/", { params });
    return {
        type: "GET_SEARCH_RESULTS",
        data,
    };
}

export async function userLeft(id) {
    // room name here too
    return {
        type: "USER_LEFT",
        id,
    };
}

export async function updateRoomState(data) {
    return {
        type: "UPDATE_ROOM_STATE",
        data,
    };
}

export async function setMyName(name) {
    return {
        type: "SET_MY_NAME",
        name,
    };
}

export async function newChatMessage(data) {
    console.log(data);
    return {
        type: "ADD_CHAT_MESSAGE",
        data,
    };
}

export async function changeHost(roomName, previousHostId) {
    const data = { roomName, previousHostId };
    return {
        type: "CHANGE_HOST",
        data,
    };
}

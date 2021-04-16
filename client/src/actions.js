// 3 functions to create three action objects

import axios from "./axios";

// getBegFriends

export async function getBegFriends() {
    const { data } = await axios.get("/beg-friends/");
    console.log(data);
    return {
        type: "GET_ALL_FRIENDS",
        data,
    };
}
// return axios get request
// return object with type "GET_BEG_FRIENDS" and the payload: array (This is the action)

// acceptFriend

export async function acceptFriend(id) {
    const { data } = await axios.post("/accept-friend/" + id);
    console.log(data);
    return {
        type: "ACCEPT_FRIEND",
        data: data.sender_id,
    };
}

// unfriend

export async function unfriend(id) {
    const { data } = await axios.post("/unfriend/" + id);
    console.log(data);
    return {
        type: "UNFRIEND",
        data: data.sender_id,
    };
}

export async function firstMessages(data) {
    return {
        type: "FIRST_MESSAGES",
        data,
    };
}

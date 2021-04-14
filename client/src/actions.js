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

// export async function acceptFriend() {
//     const { data } = await axios.post();
//     return {
//         type: "ACCEPT_FRIEND",
//     };
// }

// unfriend

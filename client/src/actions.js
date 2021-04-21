import axios from "./axios";

export async function acceptFriend(id) {
    const { data } = await axios.post("/accept-friend/" + id);

    return {
        type: "ACCEPT_FRIEND",
        data: data.sender_id,
    };
}

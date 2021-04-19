import io from "socket.io-client";
import { firstMessages, newMessage, userJoined, userLeft } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("firstMessages", (msgs) =>
            store.dispatch(firstMessages(msgs))
        );
        // the first payload arrived and is added to Redux.
        // THIS IS LISTENING TO EVENTS THAT HAPPEN ON THE SERVER
        socket.on("addChatMessage", (msg) => {
            store.dispatch(newMessage(msg));
        });

        socket.on("userJoined", (users) => {
            store.dispatch(userJoined(users));
        });

        socket.on("userLeft", (userId) => {
            store.dispatch(userLeft(userId));
        });
    }
};

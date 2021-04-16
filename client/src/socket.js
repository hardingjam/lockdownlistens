import io from "socket.io-client";
import { firstMessages, newMessage } from "./actions";

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
    }
};

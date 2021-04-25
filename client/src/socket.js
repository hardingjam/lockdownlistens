import io from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        // the first payload arrived and is added to Redux.
        // THIS IS LISTENING TO EVENTS THAT HAPPEN ON THE SERVER
    }
};

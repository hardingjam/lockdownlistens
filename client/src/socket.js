import io from "socket.io-client";

import { joinRoom, activeUser, toggleReady } from "./actions";

export let socket;
export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        //listen to events from the server
        // updating readiness
        // add members
        // add the socket.id to redux state

        socket.on("new room member", (data) => {
            console.log("socket.js join roomm data:", data);
            store.dispatch(joinRoom(data));
            // this happens when you JOIN a ROOM update the user's room in state.
            // dispatch some redux action here, with new member,
            // client needs to know who's in their room.
        });

        socket.on("your socket", (data) => {
            store.dispatch(activeUser(data));
        });

        socket.on("ready or not", (userId) => {
            console.log("ready or not", userId);
            store.dispatch(toggleReady(userId));
        });
    }
};

import io from "socket.io-client";

import {
    joinRoom,
    activeUser,
    toggleReady,
    setPlayerUrl,
    setPlayerProgress,
    setPlaying,
    toggleHostPlaying,
    userLeft,
} from "./actions";

export let socket;
export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("new room member", (data) => {
            console.log("socket.js join roomm data:", data);
            store.dispatch(joinRoom(data));
            // this happens when you JOIN a ROOM update the user's room in state.
            // dispatch some redux action here, with new member,
            // client needs to know who's in their room.
        });

        socket.on("host toggled playing", (data) => {
            console.log(data);
        });

        socket.on("your socket", (data) => {
            store.dispatch(activeUser(data));
        });

        socket.on("ready or not", (userId) => {
            console.log("ready or not", userId);
            store.dispatch(toggleReady(userId));
        });

        socket.on("update playerUrl", (playerUrl) => {
            console.log("server udating playeUrl");
            store.dispatch(setPlayerUrl(playerUrl));
        });

        socket.on("sync with host", (progress) => {
            console.log(progress);
            store.dispatch(setPlayerProgress(progress));
        });

        socket.on("host toggled playing", (room) => {
            console.log(room.hostPlaying);
            store.dispatch(toggleHostPlaying(room.hostPlaying));
        });

        socket.on("play for all", () => {
            store.dispatch(setPlaying(true));
        });

        socket.on("userleft", (id) => {
            console.log("id of user leaving:", id);
            store.dispatch(userLeft(id));
        });
        // when recieveing errors.
    }
};

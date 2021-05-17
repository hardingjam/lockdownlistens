import io from "socket.io-client";

import {
    joinRoom,
    activeUser,
    toggleReady,
    setPlayerUrl,
    setPlayerProgress,
    setPlaying,
    userLeft,
    updateRoomState,
    newChatMessage,
} from "./actions";

export let socket;
export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("new room member", (data) => {
            "socket.js join roomm data:", data;
            store.dispatch(joinRoom(data));
        });

        socket.on("your socket", (data) => {
            store.dispatch(activeUser(data));
        });

        socket.on("ready or not", (userId) => {
            "ready or not", userId;
            store.dispatch(toggleReady(userId));
        });

        socket.on("update playerUrl", (playerUrl) => {
            ("server udating playeUrl");
            store.dispatch(setPlayerUrl(playerUrl));
        });

        socket.on("sync with host", (progress) => {
            progress;
            store.dispatch(setPlayerProgress(progress));
        });

        socket.on("host toggled playing", (room) => {
            store.dispatch(updateRoomState(room));
        });

        socket.on("play for all", () => {
            store.dispatch(setPlaying(true));
        });

        socket.on("userleft", (id) => {
            store.dispatch(userLeft(id));
        });

        socket.on("user updated icon", (room) => {
            console.log("new room state");
            store.dispatch(updateRoomState(room));
        });

        socket.on("new chat message", (data) => {
            store.dispatch(newChatMessage(data));
        });
    }
};

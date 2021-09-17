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
    changeHost,
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
            store.dispatch(setPlaying(true));
        });

        socket.on("sync with host", (progress) => {
            store.dispatch(setPlayerProgress(progress));
        });

        socket.on("host toggled playing", (room) => {
            store.dispatch(updateRoomState(room));
        });

        socket.on("play for all", () => {
            store.dispatch(setPlaying(true));
        });

        socket.on("user left", (id) => {
            // needs room name
            store.dispatch(userLeft(id));
        });

        socket.on("host left the room", (roomName, prevHostId) => {
            console.log("changing host");
            store.dispatch(changeHost(roomName, prevHostId));
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

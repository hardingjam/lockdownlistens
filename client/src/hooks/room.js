import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Link } from "react-router-dom";
import { createNewRoom } from "../actions";
import { socket } from "../socket";
// should I use a hashrouter for the various room states?

export default function Room() {
    const dispatch = useDispatch();

    const onlineUsers = useSelector((state) => state.onlineUsers);

    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const [connected, setConnected] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        console.log("On the room!");
    }, []);

    function handleChange(e) {
        if (e.target.name == "roomName") {
            setRoomName(e.target.value);
        }
    }

    function handleClick(e) {
        if (e.target.name == "create") {
            if (!roomName || roomName == "") {
                setError("Please name your room");
            }
            dispatch(createNewRoom(roomName));
            socket.emit("joinRoom", roomName);
        }
        if (e.target.name == "join") {
            const joiningRoomName = prompt(
                "Enter the name of the room you'd like to join"
            );
            socket.emit("joinRoom", joiningRoomName);
        }
    }

    return (
        <div id="room-container">
            {!connected && (
                <>
                    <h1>This is your listening room</h1>
                    <p>Give your room a name...</p>
                    <input
                        className="input-field narrow"
                        name="roomName"
                        type="text"
                        placeholder="Room name"
                        onChange={(e) => handleChange(e)}
                    />

                    <button name="create" onClick={(e) => handleClick(e)}>
                        Create Room
                    </button>
                    {error && <p>{error}</p>}
                    <p>
                        Or{" "}
                        <a
                            className="blue-link"
                            name="join"
                            onClick={(e) => handleClick(e)}
                        >
                            join an existing room.
                        </a>
                    </p>
                </>
            )}
        </div>
    );
}

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Link } from "react-router-dom";
import { createNewRoom } from "../actions";
import { socket } from "../socket";
// should I use a hashrouter for the various room states?

export default function Room() {
    const myRoom = useSelector((state) => state.room);
    const playerUrl = useSelector((state) => state.playerUrl);
    const activeUser = useSelector((state) => state.activeUser);
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        console.log("On the room!");
    }, []);

    function handleChange(e) {
        if (e.target.name == "roomName") {
            setRoomName(e.target.value);
        }
        if (e.target.name == "userName") {
            setUserName(e.target.value);
        }
    }

    function handleClick(e) {
        if (e.target.name == "create") {
            if (!roomName || roomName == "") {
                setError("Please name your room");
            } else {
                // useSelector room
                socket.emit("createRoom", { roomName, userName });
            }
        }
        if (e.target.name == "join") {
            const roomName = prompt(
                "Enter the name of the room you'd like to join"
            );
            const data = { roomName, userName };
            // dispatch the room join
            socket.emit("joinRoom", data);
        }
        if (e.target.name == "setName") {
            console.log("setting name");
        }

        if (e.target.name == "toggleReady") {
            const data = { myRoom, activeUser };
            console.log("toggling ready");
            socket.emit("toggleReady", data);
        }
    }

    if (!myRoom) {
        return (
            <div id="room-lobby-container">
                <>
                    <h1>This is your listening room</h1>
                    <p>What's your name?</p>
                    <input
                        className="input-field narrow"
                        type="text"
                        name="userName"
                        onChange={(e) => handleChange(e)}
                    ></input>
                    {userName && (
                        <>
                            <p>What shall we call your room?</p>
                            <input
                                className="input-field narrow"
                                name="roomName"
                                type="text"
                                placeholder="Room name"
                                onChange={(e) => handleChange(e)}
                            />

                            <button
                                name="create"
                                onClick={(e) => handleClick(e)}
                            >
                                Create Room
                            </button>
                            {error && <p>{error}</p>}
                            <p>
                                Alternatively, you can{" "}
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
                </>
            </div>
        );
    }

    if (myRoom) {
        return (
            <div id="room-container">
                <>
                    <h1>This is your room</h1>
                    <h2>
                        {
                            myRoom.users.filter(
                                (member) => member.admin == true
                            ).name
                        }{" "}
                        is the host. When their guests, we will play their
                        selection.
                    </h2>
                    <>
                        <div id="room-members-container">
                            {myRoom.users.map((member, i) => (
                                <div id="member" key={i}>
                                    <p>{member.name}</p>
                                    <span className="readyOrNot">
                                        {member.ready ? <>🟢</> : <>🔴</>}
                                    </span>
                                    {member.id == activeUser && (
                                        <button
                                            name="toggleReady"
                                            onClick={(e) => handleClick(e)}
                                        >
                                            {member.ready ? "Unready" : "Ready"}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                </>
            </div>
        );
    }
}

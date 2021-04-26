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
    const [allReady, setAllReady] = useState(false);
    const [admin, setAdmin] = useState(false);

    // socket.on (either error) setError.

    socket.on("room exists", () => {
        setError("That name is taken, please choose another.");
    });

    socket.on("no such room", () => {
        setError("No such room exists.");
    });

    useEffect(() => {
        if (
            myRoom &&
            myRoom.users.length ==
                myRoom.users.filter((user) => user.ready).length
        ) {
            setAllReady(true);
        } else {
            setAllReady(false);
        }
        if (
            myRoom &&
            myRoom.users.filter((user) => user.id == activeUser)[0].admin
        ) {
            setAdmin(true);
        }
    }, [myRoom]);

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
                socket.emit("createRoom", { roomName, userName, playerUrl });
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

        if (e.target.name == "playForAll") {
            const data = { roomName: myRoom.roomName, playerUrl };
            socket.emit("playForAll", data);
        }
    }

    if (!myRoom) {
        return (
            <div id="room-lobby-container">
                <div id="room-form">
                    <h1>Music sounds better with you</h1>
                    <h3>
                        In a listening room, friends can enjoy music together.
                    </h3>
                    <h3>
                        The host chooses the mix, and all members' players are
                        in sync.
                    </h3>
                    <p className="margin-top">
                        To get started - give yourself a name
                    </p>
                    <input
                        className="input-field narrow"
                        type="text"
                        name="userName"
                        onChange={(e) => handleChange(e)}
                    ></input>
                    {userName && (
                        <>
                            <p className="margin-top">
                                What shall we call your room?
                            </p>
                            <input
                                className="input-field narrow"
                                name="roomName"
                                type="text"
                                placeholder="Room name"
                                onChange={(e) => handleChange(e)}
                            />

                            <button
                                className="create-room"
                                name="create"
                                onClick={(e) => handleClick(e)}
                            >
                                Create Room
                            </button>
                            {error && <p className="error">{error}</p>}
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
                </div>
            </div>
        );
    }

    if (myRoom) {
        return (
            <div id="room-container">
                <div id="room-users">
                    <h1>{myRoom.roomName}</h1>

                    <h3>
                        {myRoom.users.filter((member) => member.admin)[0].name}{" "}
                        is the host. When all guests are ready, the party can
                        begin.
                    </h3>
                    {admin && !playerUrl && (
                        <p className="error">
                            As the admin, it's up to you to{" "}
                            <Link to="/listen-now">pick the music</Link>
                        </p>
                    )}
                    <>
                        <div id="room-members-container">
                            {myRoom.users.map((member, i) => (
                                <div id="member" key={i}>
                                    <span className="readyOrNot">
                                        {member.ready ? <>🟢</> : <>🔴</>}
                                    </span>
                                    <p>{member.name}</p>
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
                        {allReady && admin && (
                            <>
                                <p>All users are ready</p>
                                <button
                                    name="playForAll"
                                    onClick={(e) => handleClick(e)}
                                >
                                    Start the music
                                </button>
                            </>
                        )}
                    </>
                </div>
            </div>
        );
    }
}

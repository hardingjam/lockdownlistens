import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setPlaying } from "../actions";
import { socket } from "../socket";
import { setMyName } from "../actions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Chat from "../hooks/chat";

// should I use a hashrouter for the various room states?

export default function Room() {
    const results = useSelector((state) => state.results);
    const myRoom = useSelector((state) => state.room);
    const playerUrl = useSelector((state) => state.playerUrl);
    const activeUser = useSelector((state) => state.activeUser);
    const isPlaying = useSelector((state) => state.isPlaying);

    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const [userName, setUserName] = useState("");
    const [admin, setAdmin] = useState(false);
    const [userIcon, setUserIcon] = useState("🎵");

    const dispatch = useDispatch();
    // socket.on (either error) setError.

    const detectUrls = function (str) {
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return str.match(urlRegex);
    };

    socket.on("room exists", () => {
        setError("That name is taken, please choose another.");
    });

    socket.on("no such room", () => {
        setError("No such room exists.");
    });

    useEffect(() => {
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
        if (e.target.name == "userIcon") {
            setUserIcon(e.target.value);
            const data = {
                roomName: myRoom.roomName,
                activeUser,
                userIcon: e.target.value,
            };
            socket.emit("setUserIcon", data);
        }
    }

    function handleClick(e) {
        if (e.target.name == "create") {
            if (!roomName || roomName == "") {
                setError("Please name your room");
            } else {
                dispatch(setMyName(userName));
                socket.emit("createRoom", { roomName, userName, playerUrl });
                setError("");
            }
        }
        if (e.target.name == "join") {
            const roomName = prompt(
                "Enter the name of the room you'd like to join"
            );
            dispatch(setMyName(userName));
            const data = { roomName, userName };
            // dispatch the room join
            socket.emit("joinRoom", data);
            setError("");
        }
        if (e.target.name == "setName") {
            ("setting name");
        }

        if (e.target.name == "toggleReady") {
            const data = { myRoom, activeUser };
            socket.emit("toggleReady", data);
        }

        if (e.target.name == "playForAll") {
            if (!playerUrl) {
                setError("Please select some music for the room.");
                ("no music chosen");
            } else {
                const data = { roomName: myRoom.roomName, playerUrl };
                socket.emit("playForAll", data);
            }
        }

        if (e.target.name == "syncWithHost") {
            dispatch(setPlaying(true));
            socket.emit("syncWithHost", myRoom.roomName);
        }

        if (e.target.name == "chooseLink") {
            const newLink = prompt(
                "Enter the URL of the music you'd like to share..."
            );
            if (
                detectUrls(newLink) &&
                newLink.indexOf("soundcloud") == -1 &&
                newLink.indexOf("mixcloud") == -1
            ) {
                setError(
                    "Currently only SoundCloud and MixCloud link are supported."
                );
            } else {
                setError("");
                socket.emit("updateUrl", {
                    roomName: myRoom.roomName,
                    playerUrl: newLink,
                });
            }
        }
    }

    if (!myRoom) {
        return (
            <div id="room-lobby-container">
                <div id="room-form">
                    <h1>Music sounds better with you.</h1>
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
                    <h1>Welcome to {myRoom.roomName}</h1>

                    <h3>
                        {myRoom.users.filter((member) => member.admin)[0].name}{" "}
                        selecting...
                    </h3>
                    {!admin && (
                        <h4>
                            <a
                                className="blue-link"
                                name="syncWithHost"
                                onClick={(e) => handleClick(e)}
                            >
                                Sync with host.
                            </a>
                        </h4>
                    )}
                    {myRoom.users.length == 1 && (
                        <p>
                            Feel free to browse through the catalogue until your
                            guests arrive.
                        </p>
                    )}
                    {admin && !playerUrl && (
                        <p className="error">
                            As the admin, it's up to you to{" "}
                            {results ? (
                                <Link className="blue-link" to="/listen-now">
                                    pick the music
                                </Link>
                            ) : (
                                <Link className="blue-link" to="/">
                                    pick the music
                                </Link>
                            )}
                        </p>
                    )}
                    {admin && (
                        <>
                            <p>
                                If you'd like to host some music not in our
                                catalogue,{" "}
                                <a
                                    name="chooseLink"
                                    className="blue-link"
                                    onClick={(e) => handleClick(e)}
                                >
                                    click here.
                                </a>
                            </p>
                            {error && <p className="error">{error}</p>}
                        </>
                    )}

                    <div id="room-members-container">
                        <Tabs>
                            <TabList>
                                <Tab>Listeners</Tab>
                                <Tab>Chat</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="chat-messages-container">
                                    {myRoom.users.map((member, i) => (
                                        <div className="member" key={i}>
                                            <p>{member.name}</p>

                                            {member.id == activeUser && (
                                                <select
                                                    name="userIcon"
                                                    value={userIcon}
                                                    onChange={(e) =>
                                                        handleChange(e)
                                                    }
                                                >
                                                    <option value="🎵">
                                                        🎵
                                                    </option>
                                                    <option value="🍸">
                                                        🍸
                                                    </option>
                                                    <option value="🦄">
                                                        🦄
                                                    </option>
                                                    <option value="🤌">🤌</option>
                                                    <option value="🦢">
                                                        🦢
                                                    </option>
                                                    <option value="💗">
                                                        💗
                                                    </option>
                                                    <option value="💀">
                                                        💀
                                                    </option>
                                                    <option value="💦">
                                                        💦
                                                    </option>
                                                    <option value="🚑">
                                                        🚑
                                                    </option>
                                                    <option value="🕊">🕊</option>
                                                </select>
                                            )}
                                            {member.id == activeUser ? (
                                                <span className="user-icon">
                                                    {userIcon}
                                                </span>
                                            ) : (
                                                <span className="user-icon">
                                                    {member.icon}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <Chat icon={userIcon} />
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

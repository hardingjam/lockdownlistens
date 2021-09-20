import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";

// import Popout from "react-popout";

export default function Chat() {
    const elemRef = useRef();
    const myRoom = useSelector((state) => state.room);
    const myName = useSelector((state) => state.myName);
    // const hostProgress = useSelector((state) => state.room.hostProgress);
    const activeUser = useSelector((state) => state.activeUser);
    const roomMessages = useSelector((state) => state.room.messages || []);
    const focusBottom = () => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    };
    const [icon, setIcon] = useState("");

    useEffect(() => {
        const me = myRoom.users.filter((user) => user.id == activeUser);
        setIcon(me[0].icon);
    }, []);

    useEffect(() => {
        focusBottom();
        // this doesn't work until the second click on the Tabs...
    }, [roomMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const data = {
                roomName: myRoom.roomName,
                user: myName,
                message: e.target.value,
            };
            socket.emit("newChatMessage", data);
            e.target.value = "";
        }
    };

    return (
        <>
            <div id="chat-container" className="flex-column">
                <div className="chat-messages-container" ref={elemRef}>
                    {roomMessages.map((msg, i) => (
                        <div className="chat-message" key={i}>
                            <h4>{msg.user}</h4>
                            <p>{msg.message}</p>
                        </div>
                    ))}
                </div>
                <textarea
                    className="chat-input"
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                />
            </div>
        </>
    );
}

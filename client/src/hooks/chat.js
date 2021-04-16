import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { firstMessages } from "../actions";

export default function Chat() {
    const elemRef = useRef();
    const dispatch = useDispatch();
    const publicMessages = useSelector(
        (state) => state && state.publicMessages
    );

    const [chat, setChat] = useState();

    useEffect(() => {
        console.log("chat hooks mounted");

        dispatch(firstMessages());
        const { scrollHeight, clientHeight } = elemRef.current;
        // scrollHeight includes everthing hidden at the bottom
        elemRef.current.scrollTop = scrollHeight - clientHeight;
    }, []);

    const keyCheck = (e) => {
        console.log(e.target.value);
        console.log("key pressed", e.key);
        // e.key tells you the key that was pressed (e.g. ENTER!)

        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("Sent new message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div id="chat-container" className="flex-column">
            <h1>Wave Talk</h1>

            <div className="chat-messages-container" ref={elemRef}>
                {publicMessages.map((msg) => (
                    <span className="chat-message" key={msg.id}>
                        {msg.message}
                    </span>
                ))}
                <span className="chat-message flex-container">Message one</span>
                <span className="chat-message flex-container">Message two</span>
                <span className="chat-message flex-container">
                    Message three!!
                </span>
                <span className="chat-message flex-container">
                    Message Four!!
                </span>
            </div>

            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            />
        </div>
    );
}

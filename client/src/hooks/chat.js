import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
// import Popout from "react-popout";

export default function Chat(props) {
    const elemRef = useRef();
    const publicMessages = useSelector((state) => state.publicMessages || []);
    // const [popped, setPopped] = useState(false);

    useEffect(() => {
        console.log("useEffect");
        console.log(props);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [publicMessages]);

    // const popOut = () => {
    //     setPopped(true);
    // };

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("Sent new message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <div id="chat-container" className="flex-column">
                <h1>Wave Talk</h1>
                <div className="chat-messages-container" ref={elemRef}>
                    {publicMessages
                        .slice()
                        .reverse()
                        .map((msg) => (
                            <div
                                className="chat-message flex-container"
                                key={msg.id}
                            >
                                <img src={msg.pic_url} className="smaller" />
                                <h4 className="yellow-text">
                                    {msg.first_name}
                                </h4>
                                <p>{msg.message}</p>
                            </div>
                        ))}
                </div>
                <textarea
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                />
                {/* <button className="button" onClick={popOut}>
                    Pop out
                </button> */}
            </div>
        </>
    );
}

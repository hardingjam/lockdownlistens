import { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import { Link, StaticRouter } from "react-router-dom";

export default function OnlineFriends() {
    const onlinePeople = useSelector((state) => state.onlineFriends);
    console.log(onlinePeople);

    return (
        <div id="chat-container" className="flex-column">
            <h1>Online Now</h1>
            <div className="chat-messages-container" ref={elemRef}></div>
        </div>
    );
}

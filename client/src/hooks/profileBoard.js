import { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import { Link, StaticRouter } from "react-router-dom";

export default function profileBoard(props) {
    return (
        <div id="board-container" className="flex-column">
            <h1>{props.firstName}'s Board</h1>
        </div>
    );
}

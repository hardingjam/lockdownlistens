import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import { useSelector, useDispatch } from "react-redux";
import { Link, StaticRouter } from "react-router-dom";
import { getBoardPosts } from "../actions";
import axios from "axios";

export default function profileBoard(props) {
    const dispatch = useDispatch();

    const boardPosts = useSelector((state) => state.boardPosts);

    useEffect(() => {
        dispatch(getBoardPosts(props.id));
    }, []);

    return (
        <div id="board-container" className="flex-column">
            <h1>{props.firstName}'s Board</h1>
            <div className="flex-column board-container">
                {boardPosts.map((post) => (
                    <div className="flex-column" key={post.id}>
                        <div className="flex-container">
                            <img src={post.pic_url} className="smaller"></img>

                            <h3>
                                {post.first_name} {post.last_name}
                            </h3>
                        </div>

                        <div>{post.post}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

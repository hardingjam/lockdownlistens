import { useEffect, useState, useRef } from "react";
import { format } from "date-fns/formatRelative";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getBoardPosts, addPost } from "../actions";

export default function profileBoard(props) {
    const buttonRef = useRef();
    const dispatch = useDispatch();
    const [post, setPost] = useState();
    const [user, setUser] = useState();

    const boardPosts = useSelector((state) => state.boardPosts);

    useEffect(() => {
        dispatch(getBoardPosts(props.profileUserId));
    }, []);

    function handleChange(e) {
        setPost(e.target.value);
    }

    function handleClick(e) {
        console.log("posting to board: ", post);
        dispatch(addPost(post, props.profileUserId));
    }

    return (
        <div id="board-container" className="flex-column">
            <h3>{props.firstName}'s Board</h3>
            <textarea
                className="post-draft"
                name="post"
                onChange={(e) => {
                    handleChange(e);
                }}
                rows={2}
            />
            <button
                className="button"
                onClick={(e) => {
                    handleClick(e);
                }}
            >
                Add Post
            </button>
            <div className="flex-column board-container">
                {boardPosts.map((post) => (
                    <div className="flex-column" key={post.id}>
                        <div
                            className={`flex-container poster-info ${props.className}`}
                        >
                            <Link to={`./user/${post.sender_id}`}>
                                <h4>
                                    {post.first_name} {post.last_name}
                                </h4>
                                <img src={post.pic_url} className="smaller" />
                            </Link>
                        </div>

                        <div>{post.post}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

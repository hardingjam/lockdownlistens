import { useEffect, useState } from "react";
// import { format } from "date-fns/formatRelative";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getBoardPosts, addPost } from "../actions";

export default function profileBoard(props) {
    const dispatch = useDispatch();
    const [post, setPost] = useState();
    const friends = useSelector((state) => state.friends);
    const boardPosts = useSelector((state) => state.boardPosts || []);

    useEffect(() => {
        dispatch(getBoardPosts(props.profileUserId));
    }, [friends]);

    function handleChange(e) {
        setPost(e.target.value);
    }

    function handleClick() {
        console.log("posting to board: ", post);
        dispatch(addPost(post, props.profileUserId));
    }

    return (
        <div id="board-container" className="flex-column">
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
                    <div className="flex-column wall-post" key={post.id}>
                        <div
                            className={`flex-container poster-info ${props.className}`}
                        >
                            <h4>
                                {post.first_name} {post.last_name}
                            </h4>
                            <Link to={`./user/${post.sender_id}`}>
                                <img src={post.pic_url} className="smaller" />
                            </Link>
                        </div>
                        {post.preview ? (
                            <div className="post-preview">
                                {post.preview.img ? (
                                    <a href={post.preview.url}>
                                        <div
                                            className={`link-preview ${props.className}`}
                                        >
                                            <img
                                                className="medium"
                                                src={post.preview.img}
                                            />
                                            <h4 className="link-preview-text">
                                                {post.preview.title}
                                            </h4>
                                        </div>
                                    </a>
                                ) : (
                                    <img
                                        src={post.post}
                                        className="large"
                                    ></img>
                                )}
                            </div>
                        ) : (
                            <div>{post.post}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

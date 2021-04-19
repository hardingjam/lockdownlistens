import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBegFriends, unfriend } from "../actions";
import { Link } from "react-router-dom";
import ProfilePic from "./profile-pic";

export default function MiniFriends(props) {
    const dispatch = useDispatch();

    const realFriends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted == true)
    );

    useEffect(() => {
        dispatch(getBegFriends());
    }, []);

    return (
        <div className="flex-column">
            {realFriends && realFriends.length ? (
                <div className="mini-friends flex-column">
                    <h3 className="heading-right">
                        Your Friends ({realFriends.length})
                    </h3>
                    {realFriends.map((friend) => (
                        <div className="result-card" key={friend.id}>
                            <Link to={{ pathname: `/user/${friend.id}` }}>
                                <ProfilePic
                                    profilePicUrl={friend.pic_url}
                                    className="smallpic"
                                />
                            </Link>
                            <div className="about-me">
                                <h3>
                                    <Link
                                        to={{ pathname: `/user/${friend.id}` }}
                                    >
                                        {friend.first_name} {friend.last_name}{" "}
                                    </Link>
                                </h3>
                                <button
                                    className="button wave unfriend"
                                    onClick={() =>
                                        dispatch(unfriend(friend.id))
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h4 className="yellow-text">You have no friends 😔</h4>
                </div>
            )}
        </div>
    );
}

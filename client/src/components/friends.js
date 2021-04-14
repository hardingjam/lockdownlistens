import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBegFriends } from "../actions";
import { Link } from "react-router-dom";
import DefaultProfilePic from "./default-pic";
export default function Friends() {
    const dispatch = useDispatch();

    const begFriends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted == false)
    );
    // const realFriends = useSelector((state) => state.friends);
    useEffect(() => {
        dispatch(getBegFriends());
    }, []);

    // if (!friends) {
    //     // this will return until we recieve data
    //     return "Loading...";
    // }

    return (
        <div className="flex-column">
            <div id="friends-container">
                <h2>Your Friends</h2>
            </div>
            {begFriends && (
                <div id="requests-container">
                    <h2>Your Waves</h2>
                    {begFriends.map((beggar) => (
                        <div className="result-card" key={beggar.id}>
                            <Link to={{ pathname: `/user/${beggar.id}` }}>
                                {beggar.pic_url ? (
                                    <DefaultProfilePic className="medium" />
                                ) : (
                                    <img
                                        className="medium"
                                        src={beggar.pic_url}
                                    />
                                )}
                            </Link>
                            <h1>REQUEST GOES HERE</h1>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

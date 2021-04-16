import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBegFriends, acceptFriend, unfriend } from "../actions";
import { Link } from "react-router-dom";
import ProfilePic from "./profile-pic";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
export default function Friends(props) {
    const dispatch = useDispatch();

    const begFriends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => !friend.accepted)
    );

    const realFriends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted == true)
    );

    useEffect(() => {
        dispatch(getBegFriends());
        console.log("props", props);
    }, []);

    if (!begFriends && !realFriends) {
        // this will return until we recieve data
        return <span className="loading">Loading...</span>;
    }

    return (
        <Tabs>
            <TabList className="tab-list">
                <Tab>Friends</Tab>
                <Tab>Waves</Tab>
            </TabList>
            <div className="flex-column">
                <TabPanel>
                    {realFriends && realFriends.length ? (
                        <div id="friends-container">
                            <h2 className="heading-right">
                                Your Friends ({realFriends.length})
                            </h2>
                            {realFriends.map((friend) => (
                                <div className="result-card" key={friend.id}>
                                    <Link
                                        to={{ pathname: `/user/${friend.id}` }}
                                    >
                                        <ProfilePic
                                            profilePicUrl={friend.pic_url}
                                            className="medium"
                                        />
                                    </Link>
                                    <div className="about-me">
                                        <h2>
                                            <Link
                                                to={{
                                                    pathname: `/user/${friend.id}`,
                                                }}
                                            >
                                                {friend.first_name}{" "}
                                                {friend.last_name}{" "}
                                            </Link>
                                        </h2>
                                        <p>{friend.bio}</p>
                                        <button
                                            className="button wave unfriend"
                                            onClick={() =>
                                                dispatch(unfriend(friend.id))
                                            }
                                        >
                                            Unfriend {friend.first_name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div id="friends-container">
                            <h4 className="yellow-text">
                                You have no friends 😔
                            </h4>
                        </div>
                    )}
                </TabPanel>
                <TabPanel>
                    {begFriends && begFriends.length ? (
                        <div id="requests-container">
                            <h2 className="heading-right">
                                Your Waves ({begFriends.length})
                            </h2>
                            {begFriends.map((beggar) => (
                                <div className="result-card" key={beggar.id}>
                                    <Link
                                        to={{ pathname: `/user/${beggar.id}` }}
                                    >
                                        <ProfilePic
                                            profilePicUrl={beggar.pic_url}
                                            className="medium"
                                        />
                                    </Link>
                                    <div className="about-me">
                                        <h2>
                                            <Link
                                                to={{
                                                    pathname: `/user/${beggar.id}`,
                                                }}
                                            >
                                                {beggar.first_name}{" "}
                                                {beggar.last_name}{" "}
                                            </Link>
                                        </h2>
                                        <p>{beggar.bio}</p>
                                        <button
                                            className="button wave"
                                            onClick={() =>
                                                dispatch(
                                                    acceptFriend(beggar.id)
                                                )
                                            }
                                        >
                                            Wave with {beggar.first_name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div id="requests-container">
                            <h4 className="yellow-text">
                                You have no pending waves 🌊
                            </h4>
                        </div>
                    )}
                </TabPanel>
            </div>
        </Tabs>
    );
}

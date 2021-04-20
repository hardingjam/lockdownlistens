import { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ProfilePic from "../components/profile-pic";
// import Popout from "react-popout";

export default function Chat() {
    const elemRef = useRef();
    const publicMessages = useSelector((state) => state.publicMessages || []);
    const onlinePeople = useSelector((state) => state.onlineUsers || []);
    const focusBottom = () => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    };
    useEffect(() => {
        focusBottom();
        // this doesn't work until the second click on the Tabs...
    }, [publicMessages, onlinePeople]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("Sent new message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <Tabs onSelect={(e) => focusBottom(e)}>
                <TabList className="tab-list">
                    <Tab>WaveRoom</Tab>
                    <Tab>Online ({onlinePeople.length})</Tab>
                </TabList>
                <TabPanel>
                    <div id="chat-container" className="flex-column">
                        <div className="chat-messages-container" ref={elemRef}>
                            {publicMessages
                                .slice()
                                .reverse()
                                .map((msg) => (
                                    <div
                                        className="chat-message flex-container"
                                        key={msg.id}
                                    >
                                        <Link
                                            to={{
                                                pathname: `user/${msg.sender_id}`,
                                            }}
                                        >
                                            <img
                                                src={msg.pic_url}
                                                className="smaller"
                                            />
                                        </Link>
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
                    </div>
                </TabPanel>
                <TabPanel>
                    <div id="chat-container" className="flex-column">
                        <div className="chat-messages-container" ref={elemRef}>
                            <h4>{onlinePeople.length} rider(s) on the wave</h4>

                            {onlinePeople.map((person) => (
                                <div className="result-card" key={person.id}>
                                    <Link
                                        to={{
                                            pathname: `/user/${person.id}`,
                                        }}
                                    >
                                        <ProfilePic
                                            profilePicUrl={person.pic_url}
                                            className="smaller"
                                        />
                                    </Link>
                                    <div className="online-user">
                                        <h3>
                                            <Link
                                                to={{
                                                    pathname: `/user/${person.id}`,
                                                }}
                                            >
                                                {person.first_name}{" "}
                                                {person.last_name}{" "}
                                            </Link>
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </>
    );
}

import axios from "../axios";

import { useState, useEffect } from "react";

export function FriendshipButton(props) {
    const [friendStatus, setFriendStatus] = useState(false);
    const [buttonText, setButtonText] = useState("");

    // which userprofile am i being rendered on?
    // other-profile will render the button, and it knows the id we need (so pass it down as props)
    // is that person friends with the logged-in user?

    async function handleClick() {
        console.log("Clicked!", { buttonText });
        const { data } = await axios.post(`/friendship/${props.friendId}`, {
            buttonText,
        });
        console.log("response from click handler:", data);
        setButtonText("Cancel Friend Request");
    }

    useEffect(() => {
        console.log("mounted", props);
        (async () => {
            const { data } = await axios.get(`/friendship/${props.friendId}`);

            if (!data.length) {
                setButtonText("Send Friend Request");
            } else {
                // else if friend request is accepted.
                // data[1].some((request) => request.accepted) {
                // setButtonText("End Friendship")

                console.log("request exists", data);
                if (data[1].some((request) => request.sender_id == data[0])) {
                    // data[1] is the requests returned, if there are any requests
                    // if requests exist, then data[0] is the id of the logged in user
                    setButtonText("Cancel Friend Request");
                }
                if (
                    data[1].some((request) => request.recipient_id == data[0])
                ) {
                    setButtonText("Accept Friend Request");
                }
            }
        })();
    });

    return (
        <>
            <button onClick={handleClick} className="button">
                {buttonText}
            </button>
        </>
    );
}

import axios from "../axios";

import { useState, useEffect } from "react";

export function FriendshipButton(props) {
    const [buttonText, setButtonText] = useState("");

    async function handleClick() {
        const { data } = await axios.post(`/friendship/${props.friendId}`, {
            buttonText,
        });
        if (data.endedFriendship) {
            setButtonText("Send Friend Request");
        } else if (data.madeRequest) {
            setButtonText("Cancel Friend Request");
        } else if (data.acceptedRequest) {
            setButtonText("End Friendship");
        }
    }

    useEffect(() => {
        console.log("mounted", props);
        (async () => {
            const { data } = await axios.get(`/friendship/${props.friendId}`);

            if (!data.length) {
                setButtonText("Send Friend Request");
            } else if (data[1].some((request) => request.accepted)) {
                setButtonText("End Friendship");
            } else if (
                data[1].some((request) => request.sender_id == data[0])
            ) {
                setButtonText("Cancel Friend Request");
            } else if (
                data[1].some((request) => request.recipient_id == data[0])
            ) {
                setButtonText("Accept Friend Request");
            }
        })();
    });

    return (
        <>
            <button onClick={handleClick} className="button widebutton">
                {buttonText}
            </button>
        </>
    );
}

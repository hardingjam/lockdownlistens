export default function (
    state = {
        loggedInUser: {},
        publicMessages: [],
        // this can solve the delay in awaiting returned new state
        // you can build an empty framework of a potential state structure
        onlineUsers: [],
        boardPosts: [],
    },
    action
) {
    if (action.type == "GET_ALL_FRIENDS") {
        state = {
            ...state,
            friends: action.data,
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            friends: state.friends.map((friend) => {
                if (friend.id == action.data) {
                    // the id of the requester on whom the click handler fired
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friends: state.friends.filter(
                (friend) => friend.id !== action.data
            ),
        };
    }

    if (action.type == "FIRST_MESSAGES") {
        state = {
            ...state,
            publicMessages: action.data,
        };
    }

    if (action.type == "NEW_CHAT_MESSAGE") {
        state = {
            ...state,
            publicMessages: [action.data, ...state.publicMessages],
        };
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: action.data,
        };
    }

    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                (user) => user.id !== action.data
            ),
        };
    }

    if (action.type == "BOARD_POSTS") {
        console.log("BOARD POSTS TRIGGERED");
        state = {
            ...state,
            boardPosts: action.data.data,
        };
    }

    // final return of state
    return state;
}

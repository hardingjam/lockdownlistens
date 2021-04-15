export default function (state = {}, action) {
    if (action.type == "GET_ALL_FRIENDS") {
        state = {
            ...state,
            friends: action.data,
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        console.log("action.data:", action.data);
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
        console.log(action.data);
        state = {
            ...state,
            friends: state.friends.filter(
                (friend) => friend.id !== action.data
            ),
        };
    }
    // final return of state
    return state;
}

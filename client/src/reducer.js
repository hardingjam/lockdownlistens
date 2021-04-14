export default function (state = {}, action) {
    // here, could console.log the state you are about to return
    if (action.type == "GET_ALL_FRIENDS") {
        state = {
            ...state,
            friends: action.data,
        };
    }
    return state;
}

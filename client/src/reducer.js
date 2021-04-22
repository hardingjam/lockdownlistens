export default function (
    state = {
        // this can solve the delay in awaiting returned new state
        // you can build an empty framework of a potential state structure
    },
    action
) {
    if (action.type == "SET_TIMEZONE") {
        state = {
            ...state,
            timezone: action.data,
        };
    }

    if (action.type == "SET_RESULTS") {
        console.log("reducer setting state");
    }

    // final return of state
    return state;
}

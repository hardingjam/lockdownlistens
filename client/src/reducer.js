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

    if (action.type == "GET_RESULTS") {
        console.log("action.payload", action.data);
        state = {
            ...state,
            results: action.data.results,
            weekDay: action.data.weekDay,
            partOfDay: action.data.partOfDay,
            timezone: action.timezone,
        };
    }
    if (action.type == "SET_PLAYER_URL") {
        state = {
            ...state,
            playerUrl: action.url,
        };
    }

    if (action.type == "CLEAR_RESULTS") {
        state = {};
    }
    // final return of state
    return state;
}

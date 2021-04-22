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

    if (action.type == "GET_RESULTS_BY_DAY") {
        state = {
            ...state,
            results: action.payload.data,
            timezone: action.payload.timezone,
        };
    }

    // final return of state
    return state;
}

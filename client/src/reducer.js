export default function (
    state = {
        room: null,
        members: [],
        name: null,
        playerUrl: "",
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

    if (action.type == "SUBMIT_POST") {
        state = {
            ...state,
            results: [action.data.data[0], ...state.results],
        };
    }

    if (action.type == "JOIN_ROOM") {
        state = {
            ...state,
            room: action.data,
        };
    }

    if (action.type == "ACTIVE_USER") {
        state = {
            ...state,
            activeUser: action.socketId,
        };
    }

    if (action.type == "TOGGLE_READY") {
        console.log("action userId", action.userId);
        state = {
            ...state,
            room: {
                ...state.room,
                users: state.room.users.map((user) => {
                    if (user.id == action.userId) {
                        if (user.ready == true) {
                            return { ...user, ready: false };
                        } else {
                            return { ...user, ready: true };
                        }
                    } else {
                        return user;
                    }
                }),
            },
        };
    }

    if (action.type == "SET_PLAYER_PROGRESS") {
        console.log(action.progress);
        state = {
            ...state,
            playerProgress: action.progress,
        };
    }

    if (action.type == "SET_PLAYING") {
        state = {
            ...state,
            isPlaying: action.boolean,
        };
    }

    if (action.type == "TOGGLE_HOST_PLAYING") {
        state = {
            ...state,
            room: {
                ...state.room,
                hostPlaying: action.boolean,
            },
        };
    }

    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            room: {
                ...state.room,
                users: state.room.users.filter((user) => user.id !== action.id),
            },
        };
    }

    if (action.type == "GET_SEARCH_RESULTS") {
        state = {
            ...state,
            searchResults: action.data,
        };
    }
    // final return of state
    return state;
}

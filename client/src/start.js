import ReactDOM from "react-dom";
import App from "./app";
// import { init } from "./socket";
// importing the init function from socket.js
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
let elem;

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

// init(store);
// init is socket
// giving socket.js access to the Redux store. Allowing us to use dispatch etc.
elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(elem, document.querySelector("main"));

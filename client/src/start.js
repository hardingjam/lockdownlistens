import ReactDOM from "react-dom";
import App from "./app";
import { init } from "./socket";
// importing the init function from socket.js
import SetLocation from "./hooks/setLocation";
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

if (location.pathname == "/welcome") {
    elem = <SetLocation />;
} else {
    console.log("Path name is not welcome!");
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));

/* ===== ACTIVATES REACT ===== */
// this file may go by other names.

import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
// if it was not an export default, i need {}

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
// this one component rendered here, can in turn render as many as it wants to!

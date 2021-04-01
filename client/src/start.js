/* ===== ACTIVATES REACT ===== */
// this file may go by other names.

import ReactDOM from "react-dom";
import Welcome from "./welcome";

// if it was not an export default, i need {}

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <h1 id="mini-logo">Wave</h1>;
}

ReactDOM.render(elem, document.querySelector("main"));
// this one component rendered here, can in turn render as many as it wants to!

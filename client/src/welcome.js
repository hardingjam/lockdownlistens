import Registration from "./registration";
import Login from "./login";
import Reset from "./reset-password";

import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div id="welcome">
            <div id="splash-logo">
                <h1 className="logo">Wave</h1>
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </div>
            </HashRouter>
        </div>
    );
}

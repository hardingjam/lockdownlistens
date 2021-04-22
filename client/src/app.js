import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import SetLocation from "./hooks/setLocation";
import Listen from "./components/listen";

// import the "otherprofile" component here.

export default function App() {
    useEffect(() => {
        console.log("On the app!");
    }, []);

    return (
        <div id="app-component">
            <h1>Hello World!</h1>
            <BrowserRouter>
                <Route
                    exact
                    path="/"
                    // exact path prevents double matches and overlaying components
                    component={SetLocation}
                />
                <Route path="/listen-now/" component={Listen}></Route>
            </BrowserRouter>
        </div>
    );
}

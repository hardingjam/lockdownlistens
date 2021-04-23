import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SetLocation from "./hooks/setLocation";
import Clock from "./hooks/clock";
import ReactPlayer from "react-player";
import Navbar from "./hooks/navbar";
import Results from "./hooks/listen-results";
import Submit from "./hooks/submit";
// import the "otherprofile" component here.

export default function App() {
    const playerUrl = useSelector((state) => state.playerUrl);

    useEffect(() => {}, []);

    return (
        <div id="app-component">
            <BrowserRouter>
                <Navbar />
                <Route
                    exact
                    path="/"
                    // exact path prevents double matches and overlaying components
                    component={SetLocation}
                />
                <Route path="/listen-now/" component={Results} />
                <Route path="/clock/" component={Clock} />
                <Route path="/submit/" component={Submit} />
            </BrowserRouter>
            <ReactPlayer
                className="jukebox"
                wrapper="div"
                width="100vw"
                height="150px"
                url={playerUrl}
                controls={true}
                playing={true}
            />
        </div>
    );
}

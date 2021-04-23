import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SetLocation from "./hooks/setLocation";
import Listen from "./components/listen";
import ReactPlayer from "react-player";
import Navbar from "./hooks/navbar";
import Results from "./hooks/listen-results";
// import the "otherprofile" component here.

export default function App() {
    const playerUrl = useSelector((state) => state.playerUrl);

    useEffect(() => {
        console.log("On the app!");
    }, []);

    return (
        <div id="app-component">
            <Navbar />
            <BrowserRouter>
                <Route
                    exact
                    path="/"
                    // exact path prevents double matches and overlaying components
                    component={SetLocation}
                />
                <Route exact path="/listen-now/" component={Results}></Route>
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

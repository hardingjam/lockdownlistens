import { useEffect, useState, useRef } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SetLocation from "./hooks/setLocation";
import ReactPlayer from "react-player";
import Navbar from "./hooks/navbar";
import Results from "./hooks/listen-results";
import Submit from "./hooks/submit";
import Room from "./hooks/room";
import { socket } from "./socket";

export default function App() {
    const playerUrl = useSelector((state) => state.playerUrl || "");
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState("");
    const playerRef = useRef(null);

    useEffect(() => {
        console.log(progress.playedSeconds);
    }, [progress]);

    socket.on("play for all", () => {
        setPlaying(true);
    });

    function handlePause() {
        setPlaying(false);
    }
    function handlePlay() {
        setPlaying(true);
    }

    function seekTest() {
        playerRef.seekTo(300, seconds);
    }

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
                <Route path="/submit/" component={Submit} />
                <Route path="/room/" component={Room} />
            </BrowserRouter>
            <button onClick={(e) => seekTest(e)}>try and seek</button>
            <ReactPlayer
                ref={playerRef}
                className="jukebox"
                wrapper="div"
                width="100vw"
                height="150px"
                url={playerUrl}
                controls={true}
                playing={playing}
                onPlay={(e) => handlePlay(e)}
                onPause={(e) => handlePause(e)}
                onProgress={setProgress}
                progressInterval={3000}
            />
        </div>
    );
}

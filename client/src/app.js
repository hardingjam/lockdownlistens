import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SetLocation from "./hooks/setLocation";
import ReactPlayer from "react-player";
import Navbar from "./hooks/navbar";
import Results from "./hooks/results";
import Submit from "./hooks/submit";
import Room from "./hooks/room";
import About from "./hooks/about";
import Search from "./hooks/search";
import { socket } from "./socket";
import { setPlaying } from "./actions";

export default function App() {
    const playerUrl = useSelector((state) => state.playerUrl || "");
    const playing = useSelector((state) => state.isPlaying);
    const playerRef = useRef(null);
    const [progress, setProgress] = useState("");
    const myRoom = useSelector((state) => state.room);
    const activeUser = useSelector((state) => state.activeUser);
    const results = useSelector((state) => state.results);
    const dispatch = useDispatch();

    useEffect(() => {
        if (myRoom && myRoom.host == activeUser) {
            progress.playedSeconds;
            const data = {
                progress: progress.playedSeconds,
                roomName: myRoom.roomName,
            };
            socket.emit("hostProgress", data);
        }
    }, [progress]);

    useEffect(() => {
        socket.on("sync with host", (seconds) => {
            playerRef.current.seekTo(seconds);
        });
    }, []);

    function handlePause() {
        if (myRoom && myRoom.host == activeUser) {
            socket.emit("hostPaused", myRoom.roomName);
        }
        dispatch(setPlaying(false));
    }
    function handlePlay() {
        if (myRoom && myRoom.host == activeUser) {
            socket.emit("hostPlayed", myRoom.roomName);
        }
        dispatch(setPlaying(true));
    }

    return (
        <div id="app-component">
            <BrowserRouter>
                <Navbar />
                <Route exact path="/" component={SetLocation} />
                <Route path="/listen-now/" component={Results} />
                <Route path="/submit/" component={Submit} />
                <Route path="/room/" component={Room} />
                <Route path="/about/" component={About} />
                <Route path="/search/" component={Search} />
            </BrowserRouter>
            {playerUrl && (
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
            )}
        </div>
    );
}

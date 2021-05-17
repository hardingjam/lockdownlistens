import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatRelative, parseISO } from "date-fns";
import { setPlayerUrl } from "../actions";
import { socket } from "../socket";

export default function Results() {
    const results = useSelector((state) => state.results);
    const timezone = useSelector((state) => state.timezone);
    const weekDay = useSelector((state) => state.weekDay);
    const partOfDay = useSelector((state) => state.partOfDay);
    const playerUrl = useSelector((state) => state.playerUrl);
    const myRoom = useSelector((state) => state.room);

    const dispatch = useDispatch();

    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (myRoom) {
            ("updating playerUrl from results");
            const data = { roomName: myRoom.roomName, playerUrl };
            socket.emit("updateUrl", data);
        }
    }, [playerUrl]);

    function handleMouseEnter(id) {
        setHover(id);
    }

    function handleMouseLeave() {
        setHover(null);
    }

    function handleClick(url) {
        url;
        dispatch(setPlayerUrl(url));
    }
    if (!results) {
        return (
            <div className="loading">
                <h3>Loading Listens...</h3>
            </div>
        );
    }
    return (
        <div className="results-container">
            <div className="first-result">
                <h2>
                    It's {weekDay} {partOfDay} in{" "}
                    {timezone
                        .slice(timezone.indexOf("/") + 1)
                        .replace("_", " ")}
                    , here's what you should listen to.
                </h2>
            </div>
            {results
                .filter((item) => item.preview)
                .map((result, i) => (
                    <div className="result-container" key={i}>
                        <div
                            className="result-preview"
                            id={result.id}
                            onMouseEnter={() => handleMouseEnter(result.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="image-container">
                                {result.preview.img ? (
                                    <img
                                        className="medium"
                                        src={result.preview.img}
                                    />
                                ) : (
                                    <img
                                        className="medium"
                                        src="https://lockdownlistens.s3.eu-central-1.amazonaws.com/pp-2.jpg"
                                    />
                                )}
                            </div>
                            {hover == result.id && (
                                <div
                                    className="result-info pointer"
                                    onClick={() => {
                                        handleClick(result.link);
                                    }}
                                >
                                    <h2>{result.preview.title}</h2>
                                    <h2>
                                        {formatRelative(
                                            parseISO(result.posted_at),
                                            new Date()
                                        )}
                                    </h2>
                                    {result.tags.length > 0 &&
                                        result.tags.map((tag, i) => (
                                            <h4 className="tags" key={i}>
                                                {tag}
                                            </h4>
                                        ))}
                                    {result.message !== "" && (
                                        <p className="result-message">
                                            {result.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}

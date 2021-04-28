import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSearchResults } from "../actions";
import { formatRelative, parseISO } from "date-fns";
import { socket } from "../socket";
import { setPlayerUrl } from "../actions";

export default function Search() {
    const searchResults = useSelector((state) => state.searchResults);
    const [time, setTime] = useState("Evening");
    const [day, setDay] = useState("Fri-Sat");
    const timezone = useSelector((state) => state.timezone);
    const weekDay = useSelector((state) => state.weekDay);
    const partOfDay = useSelector((state) => state.partOfDay);
    const playerUrl = useSelector((state) => state.playerUrl);
    const myRoom = useSelector((state) => state.room);
    const [hover, setHover] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (myRoom) {
            ("updating playerUrl from results");
            const data = { roomName: myRoom.roomName, playerUrl };
            socket.emit("updateUrl", data);
        }
    }, [playerUrl]);

    function handleChange(e) {
        if (e.target.name == "day") {
            e.target.value;
            setDay(e.target.value);
        }
        if (e.target.name == "time") {
            e.target.value;
            setTime(e.target.value);
        }
    }
    function handleClick(e) {
        if (e.target.name == "search") {
            "searching", day, time;
            const data = { day, time };
            dispatch(getSearchResults(data));
        }
        if (e.target.name == "result") {
            e;
        }
    }

    function handleMouseEnter(id) {
        setHover(id);
    }

    function handleMouseLeave() {
        setHover(null);
    }

    return (
        <div id="search-page-container">
            <div id="search-container">
                <div className="search-text">
                    <h1>Find what you're looking for.</h1>
                    <h3>
                        It's Tuesday morning, but you want peak-time Saturday
                        night? Tell us the situation, and we'll find music to
                        match.
                    </h3>
                </div>

                <div id="search-form">
                    <>
                        <h3>Which day of the week?</h3>
                        <select
                            name="day"
                            value={day}
                            onChange={(e) => handleChange(e)}
                        >
                            <option value="Sun-Tues">Sun-Tues</option>
                            <option value="Weds-Thurs">Wed-Thurs</option>
                            <option value="Fri-Sat">Fri-Sat</option>
                        </select>
                    </>

                    <h3>What time of day?</h3>
                    <select
                        name="time"
                        value={time}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                    </select>

                    <button name="search" onClick={(e) => handleClick(e)}>
                        Search
                    </button>
                </div>
            </div>

            {searchResults && (
                <div className="search-results-container">
                    {searchResults
                        .filter((item) => item.preview)
                        .map((result, i) => (
                            <div className="result-container small" key={i}>
                                <div
                                    className="result-preview small"
                                    id={result.id}
                                    onMouseEnter={() =>
                                        handleMouseEnter(result.id)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="image-container">
                                        {result.preview.img ? (
                                            <img
                                                className="small"
                                                src={result.preview.img}
                                            />
                                        ) : (
                                            <img
                                                className="small"
                                                src="https://lockdownlistens.s3.eu-central-1.amazonaws.com/pp-2.jpg"
                                            />
                                        )}
                                    </div>
                                    {hover == result.id && (
                                        <div
                                            name="result"
                                            className="result-info-small pointer"
                                            onClick={() => {
                                                dispatch(
                                                    setPlayerUrl(result.link)
                                                );
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
                                                    <h4
                                                        className="tags"
                                                        key={i}
                                                    >
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
            )}
        </div>
    );
}

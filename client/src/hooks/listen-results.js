import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatRelative, parseISO } from "date-fns";

// import Assert from "assert";

export default function Results() {
    const results = useSelector((state) => state.results);
    const timezone = useSelector((state) => state.timezone);
    const week = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const [hover, setHover] = useState(null);

    const day = new Date().getDay();

    function handleMouseEnter(id) {
        setHover(id);
    }

    function handleMouseLeave() {
        setHover(null);
    }

    return (
        <div className="results-container">
            <div className="first-result">
                <h2>
                    It's {week[day - 1]} in{" "}
                    {timezone.slice(timezone.indexOf("/") + 1)}, here's what you
                    should listen to
                </h2>
            </div>
            {results
                .filter((item) => item.preview)
                .map((result) => (
                    <div id="result-container" key={result.id}>
                        <div
                            className="result-preview"
                            id={result.id}
                            onMouseEnter={(e) => handleMouseEnter(result.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="image-container">
                                <img
                                    className="medium"
                                    src={result.preview.img}
                                />
                            </div>
                            {hover == result.id && (
                                <div className="result-info">
                                    <h2>{result.preview.title}</h2>
                                    <h2>{result.preview.title}</h2>
                                    <h4>
                                        {formatRelative(
                                            parseISO(result.posted_at),
                                            new Date()
                                        )}
                                    </h4>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}

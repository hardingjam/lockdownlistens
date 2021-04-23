import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatRelative, parseISO } from "date-fns";
import { setPlayerUrl, clearResults } from "../actions";

// import Assert from "assert";

export default function Results() {
    const results = useSelector((state) => state.results);
    const timezone = useSelector((state) => state.timezone);
    const weekDay = useSelector((state) => state.weekDay);
    const partOfDay = useSelector((state) => state.partOfDay);

    const dispatch = useDispatch();

    const [hover, setHover] = useState(null);

    useEffect(() => {
        console.log("mounting");
        return () => {
            console.log("cleaning");
        };
    }, []);

    function handleMouseEnter(id) {
        setHover(id);
    }

    function handleMouseLeave() {
        setHover(null);
    }

    function handleClick(url) {
        console.log(url);
        dispatch(setPlayerUrl(url));
    }

    if (!results || !results.length) {
        return "loading";
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
                .map((result) => (
                    <div id="result-container" key={result.id}>
                        <div
                            className="result-preview"
                            id={result.id}
                            onMouseEnter={() => handleMouseEnter(result.id)}
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
                                    <h2
                                        onClick={() => {
                                            handleClick(result.link);
                                        }}
                                    >
                                        {result.preview.title}
                                    </h2>
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
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}

import { useEffect } from "react";
import { useSelector } from "react-redux";

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

    const day = new Date().getDay();

    useEffect(() => {
        console.log(results.length);
    }, []);

    return (
        <div className="results-container">
            <h2>
                It's {week[day - 1]} in{" "}
                {timezone.slice(timezone.indexOf("/") + 1)}, here's what you
                should listen to
            </h2>
            {results.map((result) => (
                <div className="result" key={result.id}>
                    <p>{result.message}</p>
                </div>
            ))}
        </div>
    );
}

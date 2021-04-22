import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getResults } from "../actions";
import axios from "../axios";

// import Assert from "assert";

export default function Results() {
    const dispatch = useDispatch();
    const results = useSelector((state) => state.results || []);
    const timezone = useSelector((state) => state.timezone);

    function convertTZ(date, tzString) {
        return new Date(
            (typeof date === "string"
                ? new Date(date)
                : date
            ).toLocaleString("en-US", { timeZone: tzString })
        );
    }

    useEffect(() => {
        console.log("results module mounted");
        return () => {
            // cleaning up the results here
        };
    }, []);

    useEffect(() => {
        const timeNow = new Date();
        const localTime = convertTZ(
            timeNow.toISOString(),
            `${timezone}`
        ).toISOString();
        dispatch(getResults(localTime));
        return () => {
            // cleaning up the results here
        };
    }, []);

    return (
        <div id="listen-results-container">
            <h2>Results container!</h2>
        </div>
    );
}

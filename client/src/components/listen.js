import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../axios";
import Results from "../hooks/listen-results";
export default function ListenNow() {
    // const dispatch = useDispatch();
    const timezone = useSelector((state) => state.timezone || "");

    useEffect(() => {}, [timezone]);

    return (
        <div id="listen-container">
            <h1>Listen component</h1>
            {timezone && (
                <>
                    <p>Listening in timezone: {timezone}</p>
                    <Results />
                </>
            )}
        </div>
    );
}

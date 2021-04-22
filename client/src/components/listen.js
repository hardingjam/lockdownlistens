import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../axios";
import Results from "../hooks/listen-results";
export default function ListenNow() {
    // const dispatch = useDispatch();
    const results = useSelector((state) => state.results);

    return (
        <div id="listen-container">
            <h1>Listen component</h1>

            {results && (
                <>
                    <Results />
                </>
            )}
        </div>
    );
}

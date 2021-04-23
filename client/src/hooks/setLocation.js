import { useState } from "react";
import SelectTimezoneMaterialUi from "select-timezone-material-ui";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getResults } from "../actions";

export default function SetLocation() {
    const dispatch = useDispatch();
    const [tz, setTz] = useState();
    const [error, setError] = useState("");
    function handleChange(e) {
        setTz(e);
    }

    // handle the click here
    function handleClick() {
        if (tz) {
            const localTime = new Date().toLocaleString("en-US", {
                timeZone: tz,
            });
            console.log("local time:", localTime);
            dispatch(getResults(localTime, tz));
        }
    }

    return (
        <div id="timezone-container">
            <h1>Welcome to Lockdown Listens</h1>
            <h2>Please select your timezone</h2>
            <div className="timezone-selector">
                <SelectTimezoneMaterialUi
                    label="Location"
                    helperText="Please select a timezone from the list"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                {tz && (
                    <Link to="/listen-now/">
                        <button
                            onClick={(e) => {
                                handleClick(e);
                            }}
                        >
                            Listen
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import SelectTimezoneMaterialUi from "select-timezone-material-ui";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getResults } from "../actions";

export default function SetLocation() {
    const dispatch = useDispatch();
    const [tz, setTz] = useState();
    function handleChange(e) {
        setTz(e);
    }

    // handle the click here
    function handleClick() {
        if (tz) {
            const localTime = new Date().toLocaleString("en-US", {
                timeZone: tz,
            });
            dispatch(getResults(localTime, tz));
        }
    }

    return (
        <div id="timezone-container">
            <h1 className="headline">Welcome to Lockdown Listens</h1>
            <h3>Where in the world are you?</h3>
            <div className="timezone-selector">
                <SelectTimezoneMaterialUi
                    label="Location"
                    helperText="Start typing to find your city."
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
            </div>
            {tz && (
                <Link to="/listen-now/">
                    <button
                        className="button"
                        onClick={(e) => {
                            handleClick(e);
                        }}
                    >
                        Listen
                    </button>
                </Link>
            )}
        </div>
    );
}

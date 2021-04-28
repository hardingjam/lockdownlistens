import { useState } from "react";
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
            "local time:", localTime;
            dispatch(getResults(localTime, tz));
        }
    }

    return (
        <div id="timezone-container">
            <h1 className="headline">Welcome to Lockdown Listens</h1>
            <h3>Please select your timezone</h3>
            <div className="timezone-selector">
                <SelectTimezoneMaterialUi
                    label="Location"
                    helperText="Please select a timezone from the list"
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

import { useEffect, useState } from "react";
import SelectTimezoneMaterialUi from "select-timezone-material-ui";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getResults } from "../actions";

export default function SetLocation() {
    const dispatch = useDispatch();
    const [tz, setTz] = useState();
    function convertTZ(date, tzString) {
        return new Date(
            (typeof date === "string"
                ? new Date(date)
                : date
            ).toLocaleString("en-US", { timeZone: tzString })
        );
    }
    useEffect(() => {
        console.log("On the timezone picker!");
    }, []);

    function handleChange(e) {
        setTz(e);
        console.log(e);
    }

    // handle the click here
    function handleClick() {
        const timeNow = new Date();
        const timeForResults = convertTZ(
            timeNow.toISOString(),
            `${tz}`
        ).toISOString();

        dispatch(getResults(timeForResults, tz));
        // dispatch(setTimezone(tz));
    }

    return (
        <div id="timezone-container">
            <SelectTimezoneMaterialUi
                label="Location"
                helperText="Please select a timezone from the list"
                onChange={(e) => {
                    handleChange(e);
                }}
            />
            <Link to="/listen-now/">
                <button
                    onClick={(e) => {
                        handleClick(e);
                    }}
                >
                    Listen
                </button>
            </Link>
        </div>
    );
}

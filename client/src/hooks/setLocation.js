import { useEffect } from "react";
import SelectTimezoneMaterialUi from "select-timezone-material-ui";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setTimezone } from "../actions";

export default function SetLocation() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("On the timezone picker!");
    }, []);

    function handleChange(e) {
        dispatch(setTimezone(e));
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
            <Link to="./listen-now/">
                <button>Listen</button>
            </Link>
        </div>
    );
}

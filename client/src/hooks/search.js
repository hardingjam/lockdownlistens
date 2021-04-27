import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../axios";
import { getSearchResults } from "../actions";

export default function Name() {
    const searchResults = useSelector((state) => state.searchResults);
    const [time, setTime] = useState("Night");
    const [day, setDay] = useState("Fri-Sat");
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("On the search!");
    }, []);

    function handleChange(e) {
        if (e.target.name == "day") {
            console.log(e.target.value);
            setDay(e.target.value);
        }
        if (e.target.name == "time") {
            console.log(e.target.value);
            setTime(e.target.value);
        }
    }
    function handleClick(e) {
        if (e.target.name == "search") {
            console.log("searching", day, time);
            const data = { day, time };
            dispatch(getSearchResults(data));
        }
    }
    return (
        <div id="search-container">
            <section id="search-section">
                <h1>Find what you're looking for.</h1>
                <h3>
                    It's Tuesday morning, but you want peak-time Saturday night?
                    Tell us the situation, and we'll find music to match.
                </h3>
                <div id="search-form">
                    <h3>What day of the week?</h3>
                    <select
                        name="day"
                        value={day}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value="Sun-Tues">Sun-Tues</option>
                        <option value="Weds-Thurs">Weds-Thurs</option>
                        <option value="Fri-Sat">Fri-Sat</option>
                    </select>

                    <h3>What time of day?</h3>
                    <select
                        name="time"
                        value={time}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                    </select>

                    <button name="search" onClick={(e) => handleClick(e)}>
                        Select
                    </button>
                </div>
            </section>
        </div>
    );
}

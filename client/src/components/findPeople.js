import axios from "../axios";

import { useState, useEffect } from "react";

export default function FindPeople() {
    const [people, setPeople] = useState([]);
    const [query, setQuery] = useState("");

    function handleChange(e) {
        setQuery(e.target.value);
    }

    useEffect(() => {
        console.log("mounted");
        let abort = false;

        (async () => {
            const { data } = await axios.get(`/find/people/${query}`);
            if (!abort) {
                console.log(data);
                setPeople(data);
            }
        })();
        return () => {
            abort = true;
        };
    }, [query]);

    return (
        <div id="results-container">
            <h2>Finding people is easy...</h2>
            <div className="flex-container space-between">
                <h3>New members of the wave...</h3>
                <input
                    onChange={handleChange}
                    className="find-people"
                    placeholder="Find someone..."
                ></input>
            </div>
            {people.map((person, i) => {
                return (
                    <div className="result-card" key={i}>
                        <img className="medium" src={person.pic_url} />
                        <div className="about-me">
                            <h2>
                                {person.first_name} {person.last_name}
                            </h2>
                            <p>{person.bio}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

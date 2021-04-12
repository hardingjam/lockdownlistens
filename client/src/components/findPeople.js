import axios from "../axios";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
                {!query && (
                    <h4 className="yellow-text">New members of the wave...</h4>
                )}
                {query && people.length !== 0 && (
                    <h4 className="yellow-text">
                        We found these members matching your search...
                    </h4>
                )}
                {query && !people.length && (
                    <h4 className="yellow-text">
                        Sorry, that person is not riding the wave
                    </h4>
                )}
                <input
                    onChange={handleChange}
                    className="find-people"
                    placeholder="Find someone..."
                ></input>
            </div>
            {people.map((person, i) => {
                return (
                    <div className="result-card" key={i}>
                        <Link to={{ pathname: `/user/${person.id}` }}>
                            <img className="medium" src={person.pic_url} />
                        </Link>
                        <div className="about-me">
                            <h2>
                                <Link to={{ pathname: `/user/${person.id}` }}>
                                    {person.first_name} {person.last_name}{" "}
                                </Link>
                            </h2>
                            <p>{person.bio}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

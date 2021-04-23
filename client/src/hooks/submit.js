import { useEffect, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
// import { useSelector, useDispatch } from "react-redux";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

export default function Submit() {
    const [tags, setTags] = useState([]);
    const [errors, setErrors] = useState([]);
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log("On the submit!");
    }, []);

    function handleChange(e) {
        if (e.target.name == "link") {
            setLink(e.target.value);
        }
        if (e.target.name == "message") {
            setMessage(e.target.value);
        }
    }

    function handleTags() {
        setTags(tags);
    }

    function handleClick() {
        console.log("clicked submit");
    }

    return (
        <div id="submit-container">
            <section id="submit-form">
                <h2>What are you listening to right now?</h2>
                <h4>
                    LockDown Listens accepts Mixcloud and SoundCloud links.
                    <p>
                        Please tailor your submission to the time of day, and
                        day of the week.
                    </p>
                </h4>
                <h4></h4>
                <div id="sumbit-form">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Link to your music"
                        name="link"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Describe your music"
                        onChange={(e) => handleChange(e)}
                    />
                    <TagsInput
                        value={tags}
                        inputProps={{
                            placeholder: "Tags go here",
                        }}
                        onChange={handleTags}
                    />
                    {link && <button onClick={handleClick}>Submit</button>}
                </div>
            </section>
        </div>
    );
}

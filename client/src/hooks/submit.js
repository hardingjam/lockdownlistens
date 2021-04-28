import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TagsInput from "react-tagsinput";
import { sendPost } from "../actions";
import { browserHistory } from "react-router";
import { useHistory } from "react-router-dom";

export default function Submit() {
    const results = useSelector((state) => state.results);
    const weekDay = useSelector((state) => state.weekDay);
    const partOfDay = useSelector((state) => state.partOfDay);
    const history = useHistory();
    const [tags, setTags] = useState([]);
    const [errors, setErrors] = useState([]);
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    sendPost;
    const possErrs = {
        badUrl: "That doesn't appear to be a SoundCloud or MixCloud link 🕵",
        noTags: "Please add at least one tag 🍸",
        notUrl: "That's not even a URL 😒",
    };
    const detectUrls = function (str) {
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return str.match(urlRegex);
    };

    useEffect(() => {
        if (!link) {
            setErrors([]);
        }
        if (tags.length) {
            setErrors([]);
            errors;
        }
    }, [link, tags]);

    function handleChange(e) {
        if (e.target.name == "link") {
            setLink(e.target.value);
        }
        if (e.target.name == "message") {
            setMessage(e.target.value);
        }
    }

    function handleTags(tags) {
        setTags(tags);
        ("handling tags");
    }

    function handleError(err) {
        if (!errors.includes(err)) {
            setErrors([...errors, err]);
        }
    }

    function handleClick() {
        ("clicked submit");
        if (detectUrls(link)) {
            if (link.indexOf("soundcloud") == -1) {
                handleError(possErrs.badUrl);
                if (link.indexOf("mixcloud") == -1) {
                    handleError(possErrs.badUrl);
                }
            }
        }
        if (!detectUrls(link)) {
            handleError(possErrs.notUrl);
        }
        if (!tags.length) {
            handleError(possErrs.noTags);
        } else {
            ("dispatching");
            dispatch(sendPost(link, message, tags));
            if (results) {
                history.push("/listen-now/");
            } else {
                history.push("/");
            }
        }
    }

    return (
        <div id="submit-container">
            <section id="submit-form">
                {weekDay && partOfDay ? (
                    <h1>
                        What are you listening to this {weekDay} {partOfDay}?
                    </h1>
                ) : (
                    <h1>What are you listening to right now?</h1>
                )}

                <p>Lockdown Listens accepts Mixcloud and SoundCloud links.</p>
                <p>
                    Please tailor your submission to the time of day, and day of
                    the week.
                </p>
                <h4></h4>
                <div id="submit-form-fields">
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
                    {errors.length > 0 &&
                        errors.map((err, i) => <p key={errors[i]}>{err}</p>)}
                </div>
            </section>
        </div>
    );
}

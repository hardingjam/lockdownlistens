import axios from "../axios";
import { useState, useEffect } from "react";

export default function UploadForm(props) {
    const [buttonText, setButtonText] = useState("");
    const [file, setFile] = useState();

    useEffect(() => {
        console.log("mounted uploadForm", props);
        let abort = false;
        (async () => {
            if (!abort) {
                if (file) {
                    setButtonText("Upload");
                }
                setButtonText("Choose");
            }
        })();
        return () => {
            abort = true;
        };
    }, [file]);

    function handleClick() {
        let abort = false;
        (async () => {
            if (!abort) {
                if (buttonText == "Choose") {
                    console.log("clicked to choose");
                }
                if (buttonText == "Upload") {
                    var formData = new FormData();
                    formData.append("file", file);
                    formData.append("userId", props.userId);
                    setFile(formData);
                    async function uploadProfPic(formData) {
                        try {
                            let data = await axios.post("/upload", formData);
                            return data;
                        } catch (err) {
                            console.log("error in upload", err);
                        }
                    }

                    uploadProfPic(formData)
                        .then((data) => {
                            props.setProfilePic(data.data.pic_url);
                            props.hideUploader();
                        })
                        .catch((err) => console.log(err));
                }
            }
        })();
        return () => {
            abort = true;
        };
    }

    return (
        <section id="uploader">
            <div className={`${props.className}`}>
                <img
                    name="close"
                    className="close-button"
                    src="https://social-network.s3.eu-central-1.amazonaws.com/public/close.png"
                />
                <div id="upload-form">
                    <img
                        className="file-icon"
                        src="https://social-network.s3.eu-central-1.amazonaws.com/photo.png"
                    />

                    {!file && (
                        <>
                            <label htmlFor="inputfile">
                                <button
                                    name="upload"
                                    id="upload-button"
                                    onClick={() => handleClick()}
                                >
                                    {buttonText}
                                </button>
                            </label>
                            <input
                                accept="image/*"
                                name="file"
                                type="file"
                                id="inputfile"
                                onChange={() => setButtonText("Upload")}
                            ></input>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

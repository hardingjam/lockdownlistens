import axios from "../axios";
import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: false,
        };
        // this.setProfilePic = this.setProfilePic.bind(this);
        // i am doing this because I could not access "this" inside my async uploadProfPic function.
    }

    async componentDidMount() {
        console.log("props in uploader", this.props);
    }

    handleChange(e) {
        // console.log("New file selected", e);

        this.setState({
            file: e.target.files[0],
        });
    }

    handleClick(e) {
        if (e.target.name == "close") {
            this.props.hideUploader();
        }
        if (e.target.name == "upload") {
            console.log("this.state.file:", this.state.file);
            if (!this.state.file) {
                alert("Please select a file to upload");
            }
            var formData = new FormData();
            formData.append("file", this.state.file);
            formData.append("userId", this.props.userId);
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
                    console.log(data);
                    this.props.setProfilePic(data);
                })
                .catch((err) => console.log(err));
        }
    }

    render() {
        return (
            <section id="uploader">
                <img
                    onClick={(e) => {
                        this.handleClick(e);
                    }}
                    name="close"
                    className="close-button"
                    src="https://social-network.s3.eu-central-1.amazonaws.com/public/close.png"
                />

                <div id="upload-form">
                    <input
                        accept="image/*"
                        name="file"
                        type="file"
                        id="inputfile"
                        onChange={(e) => this.handleChange(e)}
                    ></input>

                    <button
                        name="upload"
                        id="upload-button"
                        onClick={(e) => {
                            this.handleClick(e);
                        }}
                    >
                        Update Photo
                    </button>
                    <button
                        name="profile"
                        id="view-profile"
                        onClick={(e) => {
                            this.handleClick(e);
                        }}
                    >
                        View Profile
                    </button>
                </div>
            </section>
        );
    }
}

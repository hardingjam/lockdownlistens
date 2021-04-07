import axios from "../axios";
import { Component } from "react";

export class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log("editor props: ", this.props);
    }

    handleChange(e) {
        if (e.target.name == "bio") {
            console.log(e.target.value);
            this.setState({
                draftBio: e.target.value,
            });
        }
    }

    handleClick(e) {
        if (e.target.name == "submitBio") {
            axios.post("/bio", this.state).then((res) => {
                console.log("response from axios", res.data.bio);
                this.setState({
                    bio: res.data.bio,
                    editing: false,
                });
            });
        }

        if (e.target.name == "editBio") {
            console.log(this.state);
            this.setState({
                editing: true,
                bio: this.props.user.bio,
            });
        }
    }

    // 1. Post the new bio the user typed (you should read it from this.state.draft)
    // 2. Set the new bio in the state of App

    render() {
        return (
            <section id="bio-editor">
                {!this.props.user.bio && (
                    <div className="about-me">
                        <h2>Tell us more about yourself...</h2>
                        <input
                            type="textarea"
                            name="bio"
                            onChange={(e) => {
                                this.handleChange(e);
                            }}
                        />
                        <button
                            name="submitBio"
                            onClick={(e) => {
                                this.handleClick(e);
                            }}
                        >
                            Submit Bio
                        </button>
                    </div>
                )}
                {this.props.user.bio && !this.state.editing && (
                    <div className="about-me">
                        <p>{this.props.user.bio}</p>
                        <button
                            className="button"
                            name="editBio"
                            onClick={(e) => {
                                this.handleClick(e);
                            }}
                        >
                            Edit Bio
                        </button>
                    </div>
                )}

                {this.state.editing && (
                    <div className="about-me">
                        <textarea
                            className="bio-draft"
                            name="bio"
                            onChange={(e) => {
                                this.handleChange(e);
                            }}
                            value={this.state.bio}
                            rows={5}
                        />

                        <button
                            className="button"
                            name="editBio"
                            onClick={(e) => {
                                this.handleClick(e);
                            }}
                        >
                            Update Bio
                        </button>
                    </div>
                )}
                {/*
                 Lots of rendering logic here, depending on whether:
                 1. You are in edit mode or not
                 2. If you are not in edit mode: whether a bio already exists
                 */}
            </section>
        );
    }
}

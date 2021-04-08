import axios from "../axios";
import { Component } from "react";

export class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
        };
    }

    async componentDidMount() {
        this.setState(
            {
                draftBio: this.props.user.bio,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    handleChange(e) {
        this.setState({
            draftBio: e.target.value,
        });
    }

    updateBio() {
        console.log("submitting");
        axios.post("/bio", this.state).then(({ data }) => {
            console.log("response from axios", data.bio);
            this.props.setBio(data.bio);
            this.setState({
                draftBio: data.bio,
            });
            this.toggleEditMode();
        });
    }

    toggleEditMode() {
        if (!this.state.editing) {
            this.setState({
                editing: true,
            });
        } else {
            this.setState({
                editing: false,
            });
        }
    }

    // 1. Post the new bio the user typed (you should read it from this.state.draft)
    // 2. Set the new bio in the state of App

    render() {
        return (
            <section id="bio-editor">
                {/* if it's being edited */}
                {this.state.editing && (
                    <div className="about-me">
                        <textarea
                            className="bio-draft"
                            name="bio"
                            onChange={(e) => {
                                this.handleChange(e);
                            }}
                            value={this.state.draftBio || this.props.user.bio}
                            rows={5}
                        />

                        <button
                            className="button"
                            name="updateBio"
                            onClick={(e) => {
                                this.updateBio(e);
                            }}
                        >
                            Save
                        </button>
                    </div>
                )}

                {!this.props.user.bio && (
                    <div className="about-me">
                        <h3>Tell us more about yourself...</h3>
                        <textarea
                            type="textarea"
                            name="bio"
                            onChange={(e) => {
                                this.handleChange(e);
                            }}
                            rows={5}
                        />
                        <button
                            name="submitBio"
                            className="button"
                            onClick={() => {
                                this.updateBio();
                            }}
                        >
                            Submit Bio
                        </button>
                    </div>
                )}
                {this.props.user.bio && !this.state.editing && (
                    <div className="about-me">
                        <p>{this.state.bio || this.props.user.bio}</p>
                        <button
                            className="button"
                            name="editBio"
                            onClick={(e) => {
                                this.toggleEditMode();
                            }}
                        >
                            Edit Bio
                        </button>
                    </div>
                )}
            </section>
        );
    }
}

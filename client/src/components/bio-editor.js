import axios from "../axios";
import { Component } from "react";

export class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
        };
    }

    handleChange(e) {
        this.setState(
            {
                draftBio: e.target.value,
            },
            () => console.log(this.props.bio, this.state.draftBio)
        );
    }

    updateBio() {
        console.log("submitting");
        if (this.state.draftBio) {
            axios.post("/bio", this.state).then(({ data }) => {
                this.props.setBio(data.bio);
                this.toggleEditMode();
            });
        } else {
            this.toggleEditMode();
        }
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
    // 2. Set the new bio in the state of App..

    render() {
        // const { bio } = this.props;
        return (
            <section id="bio-editor">
                {/* if it's being edited */}
                {this.state.editing && (
                    <>
                        <textarea
                            className="bio-draft"
                            name="bio"
                            onChange={(e) => {
                                this.handleChange(e);
                            }}
                            defaultValue={this.props.bio}
                            rows={5}
                        />

                        <button
                            className="button"
                            name="updateBio"
                            onClick={() => {
                                this.updateBio();
                            }}
                        >
                            Save
                        </button>
                    </>
                )}

                {!this.props.bio && !this.state.editing && (
                    <div>
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
                {this.props.bio && !this.state.editing && (
                    <div>
                        <p>{this.props.bio}</p>
                        <button
                            className="button"
                            name="editBio"
                            onClick={() => {
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

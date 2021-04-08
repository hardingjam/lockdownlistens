import { Component } from "react";
import { Logo } from "./components/logo";
import Profile from "./components/profile";
import ProfilePic from "./components/profile-pic";
import Uploader from "./components/uploader";
import { BrowserRouter, Route } from "react-router-dom";
// import the "otherprofile" component here.
import axios from "axios";
import OtherProfile from "./components/other-profile";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // if i try to pass this directly to my components?
            uploading: false,
        };
    }

    componentDidMount() {
        // Fetch the data: get request for the user's info
        // Set the data to the state of the App.

        axios
            .get("/home")
            .then((res) => {
                this.setState({
                    firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    profilePicUrl:
                        res.data.pic_url ||
                        "https://social-network.s3.eu-central-1.amazonaws.com/default-profile-pic.jpg",
                    id: res.data.id,
                    bio: res.data.bio,
                });
            })
            .catch((err) => console.log("error in mounting"));
    }

    showUploader() {
        this.setState({ uploading: true });
    }

    hideUploader() {
        this.setState({ uploading: false });
    }

    setProfilePic(pic) {
        this.setState((prevState) => {
            return {
                user: {
                    ...prevState,
                    // after the comma, the previous values are there
                    profilePicUrl: pic,
                },
            };
        });
    }

    setBio(newBio) {
        this.setState((prevState) => {
            return {
                user: {
                    ...prevState,
                    bio: newBio,
                },
            };
        });
    }

    render() {
        return (
            <div id="app-component">
                {/* show a loading text until axios is complete! */}

                <Logo />

                <ProfilePic
                    profilePicUrl={this.state.user.profilePicUrl}
                    userId={this.state.user.id}
                    className={"small"}
                    showUploader={() => {
                        this.showUploader();
                    }}
                />
                <BrowserRouter>
                    <div>
                        <Route
                            path="/"
                            render={() => (
                                <Profile
                                    user={this.state.user}
                                    setBio={() => {
                                        this.setBio();
                                    }}
                                    showUploader={() => {
                                        this.showUploader();
                                    }}
                                    setProfilePic={() => {
                                        this.setProfilePic();
                                    }}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    // this forces React to create the component anew if the key changes
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        {/* react router is automatically passing a prop called
                        "match", with info about the URL */}
                    </div>
                </BrowserRouter>

                {this.state.uploading && (
                    <Uploader
                        className={"small-uploader"}
                        userId={this.state.user.id}
                        setProfilePic={(pic) => {
                            this.setProfilePic(pic);
                        }}
                        hideUploader={() => {
                            this.hideUploader();
                        }}
                    />
                )}
            </div>
        );
    }
}

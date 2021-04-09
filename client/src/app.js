import { Component } from "react";
import { Logo } from "./components/logo";
import Profile from "./components/profile";
import ProfilePic from "./components/profile-pic";
import Uploader from "./components/uploader";

import { BrowserRouter, Route } from "react-router-dom";
// import the "otherprofile" component here.
import axios from "axios";
import OtherProfile from "./components/other-profile";
import FindPeople from "./components/findPeople";

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
                ...prevState,
                // after the comma, the previous values are there
                profilePicUrl: pic,
            };
        });
    }

    setBio(newBio) {
        console.log(newBio);
        this.setState((prevState) => {
            return {
                ...prevState,
                bio: newBio,
            };
        });
    }

    render() {
        const { id } = this.state;
        if (!id) {
            return "Loading...";
        }
        return (
            <div id="app-component">
                {/* show a loading text until axios is complete! */}

                <Logo />

                <ProfilePic
                    profilePicUrl={this.state.profilePicUrl}
                    userId={this.state.id}
                    className={"small"}
                    showUploader={() => {
                        this.showUploader();
                    }}
                />
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            // exact path prevents double matches and overlaying components
                            render={() => (
                                <Profile
                                    firstName={this.state.firstName}
                                    lastName={this.state.lastName}
                                    bio={this.state.bio}
                                    profilePicUrl={this.state.profilePicUrl}
                                    id={this.state.id}
                                    setBio={(bio) => {
                                        this.setBio(bio);
                                    }}
                                    showUploader={() => {
                                        this.showUploader();
                                        // refer to the event target of wherever I trigger the uploader
                                    }}
                                    setProfilePic={() => {
                                        this.setProfilePic();
                                    }}
                                />
                            )}
                        />

                        <Route
                            path="/user/:id/"
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

                        <Route path="/find/" component={FindPeople} />
                    </div>
                </BrowserRouter>

                {this.state.uploading && (
                    <Uploader
                        className={"small-uploader"}
                        userId={this.state.id}
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

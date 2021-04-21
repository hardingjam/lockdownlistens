import { Component } from "react";
import { Logo } from "./components/logo";
import Profile from "./components/profile";
import ProfilePic from "./components/profile-pic";
import Uploader from "./components/uploader";
import NavBar from "./components/navbar";
import Loader from "react-loader-spinner";

import { BrowserRouter, Route } from "react-router-dom";
// import the "otherprofile" component here.
import axios from "axios";
import OtherProfile from "./components/other-profile";
import FindPeople from "./components/findPeople";
import Friends from "./components/friends";
import Chat from "./hooks/chat";
export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                    profilePicUrl: res.data.pic_url,
                    id: res.data.id,
                    bio: res.data.bio,
                });
            })
            .catch((err) => console.log("error in mounting", err));
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
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs
            />;
        }
        return (
            <div id="app-component">
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
                    <div id="main-component">
                        <Route
                            exact
                            path="/"
                            // exact path prevents double matches and overlaying components
                            render={() => (
                                <>
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
                                </>
                            )}
                        />

                        <Route
                            path="/user/:id/"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    userId={this.state.id}
                                    // this forces React to create the component anew if the key changes
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        {/* react router is automatically passing a prop called
                        "match", with info about the URL */}
                        <Route path="/friends/" component={Friends} />
                        <Route path="/find/" component={FindPeople} />
                        <Route path="/chat" component={Chat} />

                        <NavBar />
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

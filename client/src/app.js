import { Component } from "react";
import { Logo } from "./components/logo";
import Profile from "./components/profile";
import ProfilePic from "./components/profile-pic";
import Uploader from "./components/uploader";
import axios from "axios";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
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
                    user: {
                        firstName: res.data.first_name,
                        lastName: res.data.last_name,
                        profilePicUrl:
                            res.data.pic_url ||
                            "https://social-network.s3.eu-central-1.amazonaws.com/default-profile-pic.jpg",
                        id: res.data.id,
                        bio: res.data.bio,
                    },
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
                    ...prevState.user,
                    // after the comma, the previous values are there
                    profilePicUrl: pic,
                },
            };
        });
    }

    render() {
        return (
            <div id="app-component">
                <Logo />

                <ProfilePic
                    // props go here
                    // special JSX destructure
                    // could i send the whole user object?
                    profilePicUrl={this.state.user.profilePicUrl}
                    userId={this.state.user.id}
                    className={"small"}
                    showUploader={() => {
                        this.showUploader();
                    }}
                />

                <Profile
                    user={this.state.user}
                    showUploader={() => {
                        this.showUploader();
                    }}
                />

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

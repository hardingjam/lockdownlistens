import { Component } from "react";
import { Logo } from "./components/logo";
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

    async componentDidMount() {
        // Fetch the data: get request for the user's info
        // Set the data to the state of the App.
        try {
            const res = await axios.get("/home");
            console.log(res);
            this.setState({
                user: {
                    firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    profilePicUrl:
                        res.data.pic_url ||
                        "https://social-network.s3.eu-central-1.amazonaws.com/default-profile-pic.jpg",
                    id: res.data.id,
                },
            });
        } catch {
            console.log("error in mounting");
        }
    }

    showUploader() {
        console.log("showing uploader");
        this.setState({ uploading: true });
    }

    hideUploader() {
        console.log("hiding uploader");
        this.setState({ uploading: false });
    }

    setProfilePic(pic) {
        this.setState((prevState) => {
            return {
                user: {
                    ...prevState.user,
                    pic,
                    // how to pass the JSON into this as an update?
                },
            };
        });
    }

    render() {
        return (
            <div id="app-component">
                <Logo />
                {/* things can load conditionally based of status of this.state */}
                <ProfilePic
                    // props go here
                    // special JSX destructure
                    firstName={this.state.user.lastName}
                    lastName={this.state.user.firstName}
                    profilePicUrl={this.state.user.profilePicUrl}
                    userId={this.state.user.id}
                    showUploader={() => {
                        this.showUploader();
                    }}
                />
                {this.state.uploading && (
                    <Uploader
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

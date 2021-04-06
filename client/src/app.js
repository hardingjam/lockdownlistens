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

    componentDidMount() {
        // Fetch the data: get request for the user's info
        // Set the data to the state of the App.
        axios
            .get("/home")
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    }

    showUploader() {
        this.setState({ uploading: true });
    }

    hideUploader() {
        this.setState({ uploading: true });
    }

    render() {
        return (
            <div id="app-component">
                <Logo />
                {/* things can load conditionally based of status of this.state */}
                <ProfilePic
                    //props go here
                    // special JSX destructure
                    {...this.state.user}
                    showUploader={this.showUploader}
                />
                {this.state.uploading && (
                    <Uploader
                        hideUploader={() => {
                            this.hideUploader;
                        }}
                    />
                )}
            </div>
        );
    }
}

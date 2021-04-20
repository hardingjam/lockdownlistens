import { Component } from "react";
import axios from "../axios";
import { FriendshipButton } from "../hooks/friendshipButton";
import ProfilePic from "./profile-pic";
import ProfileBoard from "../hooks/profileBoard";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        try {
            const { data } = await axios.get(
                `/user/${this.props.match.params.id}/view`
            );
            console.log("return from axios:", data);
            if (data.invalid || data.ownProfile) {
                this.props.history.push("/");
            }
            this.setState(data);
        } catch (err) {
            console.log("error in axios.get: ", err);
        }
    }

    render() {
        const { id } = this.state;
        if (!id) {
            return <span className="loading">Loading...</span>;
        }
        return (
            <section id="profile-container">
                <div className="pic-and-button">
                    <ProfilePic
                        className="large"
                        profilePicUrl={this.state.pic_url}
                    />
                    <FriendshipButton friendId={this.state.id} />
                </div>
                <div className="about-me flex-column">
                    <h1>
                        {this.state.first_name} {this.state.last_name}
                    </h1>
                    <p className="other-bio">{this.state.bio}</p>

                    <ProfileBoard
                        profileUserId={this.state.id}
                        userId={this.props.userId}
                        firstName={this.state.first_name}
                        className="other-profile"
                    />
                </div>
            </section>
        );
    }
}

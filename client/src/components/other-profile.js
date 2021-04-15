import { Component } from "react";
import axios from "../axios";
import { FriendshipButton } from "../hooks/friendshipButton";
import ProfilePic from "./profile-pic";

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
            console.log(data);
            if (data.invalid || data.ownProfile) {
                this.props.history.push("/");
            }
            this.setState(data);
        } catch (err) {
            console.log(err);
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
                    <ProfilePic className="large" src={this.state.pic_url} />
                    <FriendshipButton friendId={this.state.id} />
                </div>
                <div className="about-me">
                    <h1>
                        {this.state.first_name} {this.state.last_name}
                    </h1>
                    <p>{this.state.bio}</p>
                </div>
            </section>
        );
    }
}

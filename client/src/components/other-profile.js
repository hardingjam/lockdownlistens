import { Component } from "react";
import axios from "../axios";

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
            return "Loading";
        }
        return (
            <section id="profile-container">
                <img className="large" src={this.state.pic_url} />
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

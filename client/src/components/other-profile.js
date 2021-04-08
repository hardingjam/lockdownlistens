import { Component } from "react";
import axios from "../axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        const { data } = axios.get(`/user/${this.props.match.params}.json`);
        if (data.invalid == true) {
            this.props.history.push("/");
        }
        this.setState(data);
    }
    render() {
        return (
            <div>
                <h1>{this.state.firstName}</h1>
                <p>{this.state.bio}</p>
            </div>
        );
    }
}

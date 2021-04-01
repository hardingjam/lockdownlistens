import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            errors: false,
        };
    }

    componentDidMount() {
        console.log("mounted the registration page");
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
                // using the [] evaluates the name of whatever field we just typed into...
            }
            // () => console.log("this.state: ", this.state)
            // this is important if you want to see what state looks like immediately after state is updated
        );
    }

    render() {
        // Do NOT call setState here!! It causes an infinite loop of state updates.

        return (
            <div className="container">
                <div id="registration-component">
                    <div id="splash-logo">
                        <h1 className="logo">Wave</h1>
                        <h1>Login</h1>
                        <Link to="/registration">Registration</Link>
                    </div>
                </div>
            </div>
        );
    }
}

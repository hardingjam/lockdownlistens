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

    handleClick() {
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                console.log("response from login post");
                if (data.success) {
                    console.log("true!");
                } else {
                    this.setState({ errors: true });
                }
            })
            .catch((err) => console.log(err));
    }

    handleKeyPress(e) {
        console.log(e.charCode);
        if (e.charCode == 13) {
            this.handleClick();
        }
    }

    render() {
        return (
            <div className="container">
                <div id="registration-component">
                    {this.state.errors && (
                        <div className="error">
                            <p>Invalid email/password</p>
                        </div>
                    )}
                    <div className="container-form">
                        <div
                            id="registration-form"
                            onKeyPress={(e) => this.handleKeyPress(e)}
                        >
                            <input
                                name="email"
                                placeholder="E-Mail"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
                            <button
                                name="login"
                                onClick={(e) => this.handleClick(e)}
                            >
                                Login
                            </button>
                            <Link className="link-to-login-reg" to="/">
                                Registration
                            </Link>
                            <Link className="link-to-login-reg" to="/reset">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// enter the email

// verify that the user exists. IF they do, generate a code.
// save the code that was generated to a database

// email the code to the user. (they just gave you their email!!!)

// upon success, render the reset form (code, new password)

// check the database for the most recent code, against the user input
// another post request with email, code and new password in the body.
// check the code db for the matching email, compare it to the body.

// this whill display three different things
import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            errors: false,
        };
    }

    handleClick() {
        if (this.state.step == 1) {
            axios
                .post("/password/start", this.state)
                .then(({ data }) => {
                    if (!data.success) {
                        this.setState({ errors: true });
                    } else {
                        this.setState({ step: this.state.step + 1 });
                        this.setState({ errors: false });
                    }
                })
                .catch((err) => console.log(err));
        }
        if (this.state.step == 2) {
            console.log(this.state);
            axios
                .post("/password/verify", this.state)
                .then(({ data }) => {
                    console.log(data);
                    this.setState({ errors: false, name: data.name });
                    this.setState({ step: this.state.step + 1 });
                })
                .catch((err) => console.log(err));
        }
        if (this.state.step == 3) {
            console.log("clicked login");
            axios.get("/login");
        }
    }

    handleChange(e) {
        console.log(e.target.name);
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log(this.state.email);
    }

    render() {
        return (
            <div className="container">
                <div id="reset-component">
                    <h2>Step {this.state.step} of 3</h2>

                    {this.state.step == 1 && (
                        <div id="reset-form">
                            <h2>
                                First, enter the email address for your acccount
                            </h2>
                            <input
                                name="email"
                                placeholder="janedoe@wave.com"
                                onChange={(e) => {
                                    this.handleChange(e);
                                }}
                            />
                            <button
                                name="next"
                                onClick={() => {
                                    this.handleClick();
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {this.state.step == 2 && (
                        <div id="reset-form">
                            <h2>We've sent an email to {this.state.email}.</h2>
                            <h2>Enter your unique code and new password.</h2>
                            <input
                                name="code"
                                placeholder="abc123"
                                onChange={(e) => {
                                    this.handleChange(e);
                                }}
                            />
                            <input
                                name="password"
                                placeholder="New Password"
                                type="password"
                                onChange={(e) => {
                                    this.handleChange(e);
                                }}
                            />
                            <button
                                name="next"
                                onClick={() => {
                                    this.handleClick();
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {this.state.step == 3 && (
                        <div id="successful-update">
                            <h2>
                                Thanks, {this.state.name}. You're ready to log
                                in with your new password
                            </h2>
                            <Link to="/login">
                                <button
                                    name="next"
                                    onClick={() => {
                                        this.handleClick();
                                    }}
                                >
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}

                    {this.state.errors && (
                        <div id="errors">
                            Please check your information and try again
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

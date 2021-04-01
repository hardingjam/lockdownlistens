import { Component } from "react";
import axios from "./axios";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            errors: false,
        };
    }

    componentDidMount() {
        console.log("mounted the registration page");
    }

    handleClick(e) {
        console.log("clicked: ", e.target.name);
        if (
            this.state.first &&
            this.state.last &&
            this.state.email &&
            this.state.password
        ) {
            console.log("posting");
            axios
                .post("/register", this.state)
                .then(({ data }) => {
                    console.log("response to post register", data);
                })
                .catch((err) => console.log("err in handleClick", err));
        } else {
            this.setState({ errors: true });
        }
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
                    {/* <div id="splash-logo">
                        <h1 className="logo">Wave</h1>
                    </div> */}
                    {this.state.errors && (
                        <div id="errors">Please complete all fields</div>
                    )}
                    {/* logical and operator */}
                    {/* conditional rendering of error messages */}

                    <div className="container-form">
                        <div id="registration-form">
                            <input
                                name="first"
                                placeholder="First"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
                            <input
                                name="last"
                                placeholder="Last"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
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
                                name="register"
                                onClick={(e) => this.handleClick(e)}
                            >
                                Register
                            </button>
                            <button
                                name="login"
                                onClick={(e) => this.handleClick(e)}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

import { Component } from "react";
// lets us build React Components

// every Counter will have the methods of Component
// class components can have state, and lifecycle mehthods
// state = data (from Vue.js)
// lifecycle methods. in Vue we had "Mounted",
// in react we have mounter but it's now called componentDidMount
export default class Counter extends Component {
    constructor(props) {
        // counter knows it will be recieving props
        super(props);
        this.state = {
            // first: "Jamie",
            count: 0,
        };
    }

    componentDidMount() {
        console.log("counter mounted!");
        // this will run when the component is rendered onscreen, but never again (unless we refresh)
        // good place to make axios requests for data.
        // we can update state to personalise the experience

        // we have to use this.setState to update the state
        // it causes the component to rerender with the updated state.
        // this.setState({ first: "Caro" });
    }

    handleClick() {
        // within methods that WE define (such as handleClick), "this" does not exist.
        // we have to GIVE it a "this" by BINDING "this" from the component (using an Arrow Function)
        console.log("clicked on button");
        this.setState({ count: this.state.count + 1 });
        // this will rerender the component with updated values
    }

    render() {
        // this is a JS function, you can do any JS you want in here
        console.log("this.props: ", this.props);
        // Do NOT call setState here!! It causes an infinite loop of state updates.

        return (
            <div>
                <h2>The current count is: {this.state.count}</h2>
                <h3>{this.props.nameProp}</h3>
                {/* renders the prop */}
                <button onClick={() => this.handleClick()}>
                    {/* using an arrow here allows us to send "this" from the component down to the handleClick function */}
                    Increase count
                </button>
                <p>I'm the counter component</p>
                {/* <p>value of first in state is: {this.state.first}</p> */}
            </div>
        );
    }
}

import axios from "../axios";
import { Component } from "react";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: false,
        };
    }
}

import { Component } from "react";
import { Logo } from "./components/logo";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
// import the "otherprofile" component here.
import axios from "axios";

export default function App() {
    useEffect(() => {
        console.log("On the app!");
    }, []);

    return (
        <div id="app-component">
            <h1>Hello World!</h1>
        </div>
    );
}

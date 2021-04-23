import { useEffect } from "react";
import { BrowserRouter, Link } from "react-router-dom";
export default function Navbar() {
    useEffect(() => {
        console.log("On the navbar!");
    });

    return (
        <div id="navbar-container">
            <BrowserRouter>
                <h1>
                    <Link to="/">Home</Link>
                </h1>
            </BrowserRouter>
        </div>
    );
}

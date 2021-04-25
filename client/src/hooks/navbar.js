import { useEffect } from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
    useEffect(() => {
        console.log("On the navbar!");
    });

    return (
        <div id="navbar-container">
            <h1>
                <Link to="/submit/">Submit</Link>
            </h1>
            <h1>
                <Link to="/search">Search</Link>
            </h1>
            <h1>
                <Link to="/room">Room</Link>
            </h1>
            <h1>
                <Link to="/">Home</Link>
            </h1>
        </div>
    );
}

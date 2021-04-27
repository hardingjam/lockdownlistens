import { Link } from "react-router-dom";
export default function Navbar() {
    return (
        <div id="navbar-container">
            <>
                <h1>HI!</h1>
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
                    <Link to="/about/">About</Link>
                </h1>
                <h1>
                    <Link to="/">Home</Link>
                </h1>
            </>
        </div>
    );
}

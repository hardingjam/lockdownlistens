import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
    const results = useSelector((state) => state.results);
    return (
        <div id="navbar-container">
            <>
                <h1>
                    <Link to="/room">Room</Link>
                </h1>
                <h1>
                    <Link to="/search">Search</Link>
                </h1>
                <h1>
                    <Link to="/submit/">Submit</Link>
                </h1>
                <h1>
                    <Link to="/about/">About</Link>
                </h1>
                {!results && (
                    <h1>
                        <Link to="/">Home</Link>
                    </h1>
                )}
                {results && (
                    <h1>
                        <Link to="/listen-now/">Home</Link>
                    </h1>
                )}
            </>
        </div>
    );
}

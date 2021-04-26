import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function Navbar() {
    const timezone = useSelector((state) => state.timezone);

    return (
        <div id="navbar-container">
            {timezone && (
                <>
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
                        <Link to="/listen-now">Home</Link>
                    </h1>
                </>
            )}
        </div>
    );
}

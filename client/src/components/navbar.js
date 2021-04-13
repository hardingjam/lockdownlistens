export default function NavBar() {
    return (
        <section id="navbar-container">
            <div className="navbar">
                <p>
                    <a href="/">Profile</a>
                </p>
                <p>
                    <a href="/find">People</a>
                </p>
                <p>
                    <a href="/logout">Log Out</a>
                </p>
            </div>
        </section>
    );
}

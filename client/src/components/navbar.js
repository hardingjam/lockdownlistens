export default function NavBar() {
    return (
        <section id="navbar-container">
            <div className="navbar">
                <p>
                    <a href="/">My Profile</a>
                </p>
                <p>
                    <a href="/find">Find People</a>
                </p>
                <p>
                    <a href="/logout">Log Out</a>
                </p>
            </div>
        </section>
    );
}

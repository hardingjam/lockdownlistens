export default function DefaultProfilePic(props) {
    return (
        <section id="profile-pic-container large">
            <img
                // I can use classNames with props to customise each instance of a component.
                className={`profile-pic ${props.className}`}
                src="https://social-network.s3.eu-central-1.amazonaws.com/default-profile-pic.jpg"
            />
        </section>
    );
}

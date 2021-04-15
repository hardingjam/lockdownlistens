export default function ProfilePic(props) {
    return (
        <section id="profile-pic-container">
            <img
                // I can use classNames with props to customise each instance of a component.
                className={`profile-pic ${props.className}`}
                src={
                    props.profilePicUrl ||
                    "https://social-network.s3.eu-central-1.amazonaws.com/default-profile-pic.jpg"
                }
                onClick={() => {
                    console.log("Clicked the pic");
                    props.showUploader();
                }}
            />
        </section>
    );
}

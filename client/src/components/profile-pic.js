export default function ProfilePic(props) {
    return (
        <section id="profile-pic-container">
            <img
                // I can use classNames with props to customise each instance of a component.
                className={`profile-pic ${props.className}`}
                src={props.profilePicUrl}
                onClick={() => {
                    console.log("Clicked the pic");
                    props.showUploader();
                }}
            />
        </section>
    );
}

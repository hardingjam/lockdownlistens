export default function ProfilePic(props) {
    // showUploader is passed down from app.js
    // likewise, the image
    console.log("showUploader: ", props.showUploader);
    return (
        <section id="profile-pic-container">
            <img
                // I can use classNames with props to customise each instance of a component.
                id="profile-pic"
                src={props.profilePicUrl}
                onClick={() => {
                    console.log("Clicked the pic");
                    props.showUploader();
                }}
            />
        </section>
    );
}

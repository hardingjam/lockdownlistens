export default function ProfilePic(props) {
    // showUploader is passed down from app.js
    // likewise, the image!
    console.log("props in profile pic: ", props);
    return (
        <section id="profile-pic-container">
            <img
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

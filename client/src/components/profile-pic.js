export default function ProfilePic(props) {
    // showUploader is passed down from app.js
    console.log(props);
    return (
        <section id="profile-pic">
            <img
                src={props.profilePic}
                alt={(props.firstName, props.lastName)}
            />
        </section>
    );
}

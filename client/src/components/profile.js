import ProfilePic from "./profile-pic.js";
import { BioEditor } from "./bio-editor";

export default function Profile(props) {
    console.log("profile props: ", props);
    return (
        <section id="profile-container">
            <ProfilePic
                profilePicUrl={props.user.profilePicUrl}
                className={"large"}
            />
            <div className="about-me">
                <h1>
                    {props.user.firstName} {props.user.lastName}
                </h1>
                <BioEditor user={props.user} />
            </div>
        </section>
    );
}

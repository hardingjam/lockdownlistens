import ProfilePic from "./profile-pic.js";
import { BioEditor } from "./bio-editor";

export default function Profile(props) {
    return (
        <section id="profile-container">
            <ProfilePic
                profilePicUrl={props.profilePicUrl}
                className={"large"}
                showUploader={props.showUploader}
            />

            <div className="about-me">
                <h1>
                    {props.firstName} {props.lastName}
                </h1>
                <BioEditor
                    bio={props.bio}
                    id={props.id}
                    setBio={props.setBio}
                />
            </div>
        </section>
    );
}

import ProfilePic from "./profile-pic.js";
import { BioEditor } from "./bio-editor";
import MiniFriends from "./friends-mini";
import ProfileBoard from "../hooks/profileBoard";
export default function Profile(props) {
    return (
        <section id="profile-container">
            <div id="profile-left-container">
                <ProfilePic
                    profilePicUrl={props.profilePicUrl}
                    className={"large"}
                    showUploader={props.showUploader}
                />
                <ProfileBoard firstName={props.firstName} />
            </div>
            <div className="about-me">
                <h1>
                    {props.firstName} {props.lastName}
                </h1>
                <BioEditor
                    bio={props.bio}
                    id={props.id}
                    setBio={props.setBio}
                />

                <MiniFriends />
            </div>
        </section>
    );
}

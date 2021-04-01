// function component
// "presentational components" - are used to just present or render something onscreen

import Registration from "./registration";

export default function HelloWorld() {
    const name = "Jamie";
    // return what looks like HTML (it's actually JSX)
    // JS that describes the UI
    return (
        <div>
            <Registration />
            {/* Rendering the imported Counter component, WITH PROPS! */}
        </div>
        // function components don't have a "This"
    );
}

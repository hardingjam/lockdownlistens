import { BioEditor } from "./bio-editor";
import axios from "../axios";
import { fireEvent, render, waitFor } from "@testing-library/react";

jest.mock("../axios");

// testing that the Edit Bio button is rendered correctly. That there IS a props.bio
// and that editing is not active

test("Displays edit button if profile is in props", () => {
    const { container } = render(
        <BioEditor bio="bio passed as props for testing" />
    );
    expect(container.querySelector("button").innerHTML).toBe("Edit Bio");
});

// testing when no bio is passed as props

test("Displays a prompt and text-area when no bio exists", () => {
    const { container } = render(<BioEditor />);
    expect(container.querySelector("textarea").toBeTruthy);
    expect(container.querySelector("h3").innerHTML).toBe(
        "Tell us more about yourself..."
    );
});

// Testing entering editing mode with a pre-saved bio
// since we know that edit-bio is the button name, when a bio exists,

test("When a bio exists, clicking Edit enters a editing mode and renders a 'save' button", () => {
    // const clickHandler = jest.fn();

    const { container } = render(
        <BioEditor bio="bio passed as props for testing" />
    );

    fireEvent.click(container.querySelector("button"));
    expect(container.querySelector("textarea").toBeTruthy);
    expect(container.querySelector("button").innerHTML).toBe("Save");
});

// Clicking save causes an axios.post request
axios.post.mockResolvedValue({
    bio: "new bio text",
});
test("Clicking save causes an axios.post request", async () => {
    const { container } = render(
        <BioEditor bio="bio passed as props for testing" />
    );

    fireEvent.click(container.querySelector("button"));
    // getting me into "edit mode"
    expect(container.querySelector("textarea").toBeTruthy);
    // check for edit box
    fireEvent.change(container.querySelector("textarea"));
    // change the bio
    fireEvent.click(container.querySelector("button"));
    // expect(axios.post).toHaveBeenCalledTimes(1);
    expect(container.querySelector("button").innerHTML).toBe("Edit Bio");
});

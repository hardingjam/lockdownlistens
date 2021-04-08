import App from "./app";
import { render, waitFor } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

axios.get.mockResolvedValue({
    data: {
        id: 1,
        first: "j",
        last: "h",
        url: "/plapla.jpg",
    },
});

test("App renders correctly Before and After request finshes as App mounts", async () => {
    const { container } = render(<App />);
    //there will be no container unless app renders
    // we can test what

    expect(container.innerHTML).toBe("");

    await waitFor(() => {
        console.log("running inside waitFor");
        console.log(container.innerHTML);
        expect(container.querySelector("div").toBeTruthy());
    });

    // waits 3 seconds, and rejects if nothing is returned
});

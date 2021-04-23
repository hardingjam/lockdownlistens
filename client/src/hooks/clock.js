import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Clock() {
    useEffect(() => {
        console.log("On the clock!");
    }, []);

    return <div id="radial-container"></div>;
}

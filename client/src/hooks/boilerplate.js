import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Name() {
    const dispatch = useDispatch();

    useEffect(() => {
        ("On the hook!");
    }, []);

    return <div id="hook-container"></div>;
}

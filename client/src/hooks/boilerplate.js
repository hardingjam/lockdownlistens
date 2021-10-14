import { useEffect, useState } from "react";

export default function Name() {
    useEffect(() => {
        ("On the hook!");
    }, []);

    return <div id="hook-container"></div>;
}

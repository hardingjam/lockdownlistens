import { useState } from "react";
import axios from "../axios";
export function useAuthSubmit() {
    const [error, setError] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
    };
}

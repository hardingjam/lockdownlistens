import { useState } from "react";

export default function useStatefulFields() {
    // because this is a hook, the fn name starts with "use"
    const [values, setValues] = useState({});
    const handleChange = (e) => {
        setValues({
            [e.target.name]: e.target.value,
        });
        console.log("In hook, values updated: ", values);
    };
    return [values, handleChange];
}

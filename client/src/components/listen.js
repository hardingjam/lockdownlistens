import { useSelector } from "react-redux";

import Results from "../hooks/listen-results";
export default function ListenNow() {
    // const dispatch = useDispatch();
    const results = useSelector((state) => state.results);

    return (
        <div id="listen-container">
            {results && (
                <>
                    <Results />
                </>
            )}
        </div>
    );
}

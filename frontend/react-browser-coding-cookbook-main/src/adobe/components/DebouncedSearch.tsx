import { ChangeEvent, useState } from "react"
import { useFetchData } from "../../hooks/useFetchData";
import useDebounce from "../hooks/useDebounce";

const DebouncedSearch = () => {
    const [query, setQuery] = useState("");

    const debouncedQuery = useDebounce(query);

    const {data, error, loading} = useFetchData(`https://api.github.com/search/users?q=${debouncedQuery}`);
    const users = (data as Record<string, any>)?.items ?? [];

    console.log("data : ", data);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    return (
        <div>
            <div>Debounce search</div>
            <div>
                <input
                    name="query"
                    value={query}
                    placeholder="Type here to search github user..."
                    onChange={handleChange}
                />
            </div>
            <div>
                <ul>
                    {(users as unknown as any)?.map((user: any) => (
                        <li key={user.id}>
                            <div>
                                <h3>{user.login}</h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DebouncedSearch;
